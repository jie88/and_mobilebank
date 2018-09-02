define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var organizationList = [
					{'key':'0','value':'小企业金融服务中心'},
					{'key':'1','value':'大企业金融服务中心'}
					];
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		var applyMoney = self.applyMoney;
		var loanDate = self.loanDate;
		var payType = self.payType;
		var useType = self.useType;
		
		//绑定账号列表
		var iAccountInfoList = [];
		var accountPickerList = [];
		var accountPicker;
		
		//当前选定账号对象
		var currentAcct;
				
		queryDefaultAcct();
		
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack, 2);
		
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0];
					$("#accountNo").html(format.dealAccountHideFour(currentAcct.accountNo));
				}
		
			}
		
		}
		function getPickerList(iAccountInfoList) {
			if(iAccountInfoList.length > 0) {
				accountPickerList = [];
				for(var i = 0; i < iAccountInfoList.length; i++) {
					var account = iAccountInfoList[i];
					var pickItem = {
						value: i,
						text: account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({
					title: "请选择付款账号",
					fireEvent: "payAccount"
				});
				accountPicker.setData(accountPickerList);
			}
		}
		
		$("#changeAccount").on("tap", function() {
			document.activeElement.blur();
			accountPicker.show();
		});
		
		window.addEventListener("payAccount", function(event) {
			var param = event.detail;
			currentAcct = iAccountInfoList[param.value];
			$("#accountNo").html(format.dealAccountHideFour(currentAcct.accountNo));
		});
		
		
		$("#next").on('tap',function(){
			var params = {
				applyMoney: applyMoney,
				loanDate: loanDate,
				payType: payType,
				useType: useType,
				accountNo : currentAcct.accountNo,
				organization : $("#organization").html(),
				applyArea : $("#applyArea").html(),
				commendNo : $("#commendNo").val(),
				noCheck : false
			};
			mbank.openWindowByLoad('../taxLoans/faxLoanThree.html','faxLoanThree','slide-in-right',params);
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