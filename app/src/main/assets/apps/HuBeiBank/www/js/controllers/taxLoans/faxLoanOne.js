define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var loanDateList = [
					{'key':'三个月','value':'0'},
					{'key':'六个月','value':'1'},
					{'key':'九个月','value':'2'},
					{'key':'十二个月','value':'3'}
					];
	var payTypeList = [
					{'key':'等额本金','value':'0'},
					{'key':'等额本息','value':'1'},
					{'key':'按月付息,到期还本','value':'2'}
					];
	var useTypeList = [
					{'key':'进货','value':'0'},
					{'key':'流动资金周转','value':'1'},
					{'key':'工资发放','value':'2'},
					{'key':'经营场所装修','value':'3'}
					];				
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		var applyMoney;//申请金额
		//下拉框    期限    方式    用途 
		var loanPicker;
		var loanPickerList;
		var payPicker;
		var payPickerList;
		var usePicker;
		var usePickerList;
		
		//上送数据
		var loanDate = loanDateList[0].key;
		var payType = payTypeList[0].key;
		var useType = useTypeList[0].key;
		$("#loanDate").html(loanDateList[0].key);
		$("#loanDate").val(loanDateList[0].value);
		
		$("#payType").html(payTypeList[0].key);
		$("#payType").val(payTypeList[0].value);
		
		$("#useType").html(useTypeList[0].key);
		$("#useType").val(useTypeList[0].value);
		//输入金额格式化
		$("#applyMoney").on("blur",function(){
			applyMoney = $(this).val();
			//alert(applyMoney);
			$(this).val(format.formatMoney($(this).val()));
		});
		
		/*
		 * 选择贷款期限
		 */
		getLoanPickerList(loanDateList);
		$("#changeLoanDate").on('tap',function(){
			document.activeElement.blur();
			loanPicker.show();
		});
		
		function getLoanPickerList(list){
			if( list.length>0 ){
				loanPickerList=[];
				for( var i=0;i<list.length;i++ ){
					var curr=list[i];
					var pickItem={
						value:curr.value,
						text:curr.key
					};
					loanPickerList.push(pickItem);
				}
				loanPicker = new mui.SmartPicker({title:"选择贷款期限",fireEvent:"loanDate"});
			    loanPicker.setData(loanPickerList);	
			}
		}
		
		window.addEventListener("loanDate", function(event) {
			var param = event.detail;
			loanDate = param.text;
			$("#loanDate").html(param.text);
			//$("#loanDate").val(param.value);
		});
		
		/*
		 * 选择还款方式
		 */
		getPayPickerList(payTypeList);
		$("#changePayType").on('tap', function() {
			document.activeElement.blur();
			payPicker.show();
		});
		
		function getPayPickerList(list) {
			if(list.length > 0) {
				payPickerList = [];
				for(var i = 0; i < list.length; i++) {
					var curr = list[i];
					var pickItem = {
						value: curr.value,
						text: curr.key
					};
					payPickerList.push(pickItem);
				}
				payPicker = new mui.SmartPicker({
					title: "选择付款方式",
					fireEvent: "payType"
				});
				payPicker.setData(payPickerList);
			}
		}
		
		window.addEventListener("payType", function(event) {
			var param = event.detail;
			payType = param.text;
			$("#payType").html(param.text);
			//$("#payType").val(param.value);
		});
		
		/*
		 * 选择贷款用途
		 */
		getUsePickerList(useTypeList);
		$("#changeUseType").on('tap', function() {
			document.activeElement.blur();
			usePicker.show();
		});
		
		function getUsePickerList(list) {
			if(list.length > 0) {
				useTypeList = [];
				for(var i = 0; i < list.length; i++) {
					var curr = list[i];
					var pickItem = {
						value: curr.value,
						text: curr.key
					};
					useTypeList.push(pickItem);
				}
				usePicker = new mui.SmartPicker({
					title: "选择用途",
					fireEvent: "useType"
				});
				usePicker.setData(useTypeList);
			}
		}
		
		window.addEventListener("useType", function(event) {
			var param = event.detail;
			useType = param.text;
			$("#useType").html(param.text);
			//$("#payType").val(param.value);
		});
		
		$("#next").on('tap',function(){
			if( IsEmpty($("#applyMoney").val()) ){
				mui.alert("请输入申请金额");
				return;
			}
			var params = {
				applyMoney : $("#applyMoney").val(),
				loanDate : loanDate,
				payType : payType,
				useType : useType,
				noCheck : false
			};
			mbank.openWindowByLoad('../taxLoans/faxLoanTwo.html','faxLoanTwo','slide-in-right',params);
		});
		mbank.resizePage('.btn_bg_f2');
	});
});