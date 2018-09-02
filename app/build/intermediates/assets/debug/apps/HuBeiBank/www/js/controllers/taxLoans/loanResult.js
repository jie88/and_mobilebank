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
		subTime = format.formatDate(subTime);
		nativeUI.showWaiting();
			setTimeout(function(){
				$(".line4").css("border-bottom","1px solid red");
				$("#content").html("放款成功");
				$("#subTime").html(subTime.substring(0,4)+'.'+subTime.substring(5,7)+'.'+subTime.substring(8,10)+'提交');
				$("#loanTime").html(subTime.substring(0,4)+'.'+subTime.substring(5,7)+'.'+subTime.substring(8,10)+'(已结清)');
				$("#applyMoney").html("¥"+format.formatMoney(applyMoney));
				$("#funImg").show();
				nativeUI.closeWaiting();
			},2000);
		
		
		
		/*$("#loanTime").append('<div style="width: 40px;font-size: 10px;text-align: center;">'+
								'<p style="background-color:darkgoldenrod;color: white;padding-left: 5px;padding-right: 5px;">已结清</p>'+
							'</div>');*/
		
		
		
		
		
		$("#applyAgain").on('tap',function(){
			mbank.openWindowByLoad("../taxLoans/faxLoanOne.html",'faxLoanOne','slide-in-right',null);
		});
		
		mui.back = function(){
			mbank.backToIndex(false);
		};
		mbank.resizePage('.btn_bg_f2');
	});
});