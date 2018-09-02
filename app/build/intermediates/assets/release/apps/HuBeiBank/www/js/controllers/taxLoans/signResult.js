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
		$("#applyMoney").html("¥"+format.formatMoney(applyMoney));
		
		$("#applyMoneyBt").on('tap',function(){

			nativeUI.showWaiting();
			setTimeout(function(){
				$(".line4").css("border-bottom","1px solid red");
				$("#applyImg").css("src","../../img/red@3x.png");
				$("#content").html(subTime.substring(0,4)+'.'+subTime.substring(5,7)+'.'+subTime.substring(8,10)+'(已结清)');
				$("#state").text("放款成功");
				$("#funImg").show();
				$("#applyMoneyBt").hide();
				$("#subBt").show();
				nativeUI.closeWaiting();
			},3000);
		});
		
		$("#subBt").on('tap',function(){
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

			mbank.openWindowByLoad('../myOwn/clientHome.html','clientHome','slide-in-right',params);
			
		});
		mui.back = function(){
			mbank.backToIndex(false);
		}
	});
});