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
		
		var subTime = new Date();
		subTime = format.formatDate(subTime)
		$("#subTime").html(subTime.substring(0,4)+'.'+subTime.substring(5,7)+'.'+subTime.substring(8,10)+'提交');

		nativeUI.showWaiting();
		setTimeout(function(){
			//mbank.openWindowByLoad('../taxLoans/checkResult.html','checkResult','slide-in-right',params);
			$("#checkImg").attr('src','../../img/red@3x.png');
			$("#funImg").show();
			$("#nextBt").show();
			$(".line1").css("border-bottom","1px solid red");
			$(".line2").css("border-bottom","1px solid red");
			$("#stateTitle").empty().html("审核通过");
			nativeUI.closeWaiting();
		},2000);
		
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
				mbank.openWindowByLoad('../faxLoans/firmIdCheck.html','firmIdCheck','slide-in-right',params);
				nativeUI.closeWaiting();
			},2000);*/
			mbank.openWindowByLoad('../taxLoans/signOnline.html','signOnline','slide-in-right',params);
			
		});
		mbank.resizePage('.btn_bg_f2');
	});
});