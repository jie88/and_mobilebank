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

		$("#signIn").on('tap',function(){
			nativeUI.showWaiting();
			setTimeout(function(){
				
				nativeUI.closeWaiting();
				//nativeUI.toast("签约成功");
				$("#singName").html("张三<br /> 印之");
				document.getElementById("signName").style.display="block";
				
				$("#btBox").show();
			},3000);
		});

		
		$("#next").on('tap',function(){
			var params = {
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
				noCheck : false
			};
			/*nativeUI.showWaiting();
			setTimeout(function(){
				
				nativeUI.closeWaiting();
			},2000);*/
			mbank.openWindowByLoad('../taxLoans/firmIdCheck.html','firmIdCheck','slide-in-right',params);
		});
		mbank.resizePage('.btn_bg_f2');
	});
});