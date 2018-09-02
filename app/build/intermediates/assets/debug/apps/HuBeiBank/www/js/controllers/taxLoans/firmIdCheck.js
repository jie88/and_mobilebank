define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var nativeUI = require('../../core/nativeUI');
	
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
		var creditNo = self.creditNo;
		var registerNo = self.registerNo;
		var checkNo = self.checkNo;
		var organizationNo = self.organizationNo;
		$("#creditNo").html(format.dealAccountHideFour(creditNo));
		
		/*$("#sendPassword").on('tap',function(){
			var params = {
				id : 'sendPassword',
				smsContent : '。您正在进行企业身份认证。'
			};
			mbank.getSmsCode(params);
		});*/
		$("#next").attr("disabled",true);
		$("#allCheck").on('click',function(){
			
			var arr = document.getElementsByName("info");
			//alert( this.checked);
			if( this.checked ){
				for(var i=0;i<arr.length;i++){
					arr[i].checked=true;
				}
				$("#next").attr("disabled",false);
			}else{
				for(var i=0;i<arr.length;i++){
					arr[i].checked=false;
				}
				$("#next").attr("disabled",true);
			}
		});
		
		$("#next").on('tap',function(){
			/*if( IsEmpty($("#mobileNo").val()) ){
				mui.alert("请输入法人手机号");
				return;
			}
			if( IsEmpty($("#smsPassword").val()) ){
				mui.alert("请输入短信验证码");
				return;
			}*/
			var params ={
				applyMoney: applyMoney,
				loanDate: loanDate,
				payType: payType,
				useType: useType,
				accountNo : accountNo,
				organization : organization,
				applyArea : applyArea,
				creditNo : creditNo,
				commendNo : commendNo,
				registerNo : registerNo,
				checkNo : checkNo,
				organizationNo : organizationNo,
				mobileNo : $('#mobileNo').val(),
				noCheck : false
			};
			nativeUI.showWaiting();
			setTimeout(function(){
				mbank.openWindowByLoad('../taxLoans/checkResult.html','checkResult','slide-in-right',params);
				nativeUI.closeWaiting();
			},2000);
			
		});
		mbank.resizePage('.btn_bg_f2');
	});
});