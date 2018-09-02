define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var photoList = [
					{'key':'0','value':'统一社会信用代码'},
					{'key':'1','value':'营业执照'}
					];
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		var applyMoney = self.applyMoney;
		var loanDate = self.loanDate;
		var payType = self.payType;
		var useType = self.useType;
		var accountNo = self.accountNo;
		var organization = self.organization;
		var applyArea = self.applyArea;
		var commendNo = self.commendNo;
		//机构号列表
		var photoPicker;
		var photoPickerList = [];
		
		var photoType;
		
		$("#companyPhotoType").html(photoList[0].value);
		photoType = photoList[0].key;
		/*
		 * 显示证件照类型
		 */
		getPhotoPickerList(photoList);
		$("#changePhotoType").on('tap', function() {
			document.activeElement.blur();
			photoPicker.show();
		});
		
		function getPhotoPickerList(list) {
			if(list.length > 0) {
				photoPickerList = [];
				for(var i = 0; i < list.length; i++) {
					var curr = list[i];
					var pickItem = {
						value: curr.key,
						text: curr.value
					};
					photoPickerList.push(pickItem);
				}
				photoPicker = new mui.SmartPicker({
					title: "请选择证件照类型",
					fireEvent: "photo"
				});
				photoPicker.setData(photoPickerList);
			}
		}
		
		window.addEventListener("photo", function(event) {
			var param = event.detail;
			$("#companyPhotoType").html(param.text);
			photoType = param.value;
			//alert(photoType);
		});
		
		$("#next").on('tap',function(){
			if( photoType==0 && IsEmpty($("#creditNo").val()) ){
				//证件类型为信用代码
				mui.alert("信用代码不能为空");
				return;
			}
			if( photoType==1){
				//证件类型为营业执照
				if( IsEmpty($("#registerNo").val()) ){
					mui.alert("请输入注册号");
					return;
				}
				if( IsEmpty($("#checkNo").val()) ){
					mui.alert("请输入税务登记号");
					return;
				}
				if( IsEmpty($("#organizationNo").val()) ){
					mui.alert("请输入组织机构号");
					return;
				}
			}
			var params ;
			if( photoType=='0' ){
				params = {
					applyMoney: applyMoney,
					loanDate: loanDate,
					payType: payType,
					useType: useType,
					accountNo : accountNo,
					organization : organization,
					applyArea : applyArea,
					commendNo : commendNo,
					creditNo : $("#creditNo").val(),
					noCheck : false
				};
			}else if( photoType=='1' ){
				params = {
					applyMoney: applyMoney,
					loanDate: loanDate,
					payType: payType,
					useType: useType,
					accountNo : accountNo,
					organization : organization,
					applyArea : applyArea,
					commendNo : commendNo,
					registerNo : $("#registerNo").val(),
					checkNo : $("#checkNo").val(),
					organizationNo : $("#organizationNo").val(),
					noCheck : false
				}
			}
			
			mbank.openWindowByLoad('../taxLoans/faxLoanFour.html','faxLoanFour','slide-in-right',params,true);

			
		});
		
		$("#cancel").on('tap',function(){
			var bts = ["是", "否"];
				mui.confirm("取消返回首页，是否取消？", "提示", bts, function(e) {
					var i = e.index;
						if(i == 0) {
							mbank.backToIndex(false);
						} else {
							i =0 ;
						}
					});
		});
		
		mbank.resizePage('.btn_bg_f2');
	});
});