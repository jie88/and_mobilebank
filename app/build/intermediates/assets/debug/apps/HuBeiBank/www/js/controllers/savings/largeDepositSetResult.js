define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
    
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var accountNo = self.accountNo;
		var largeDepositPeriod = self.savingPeriod;
		var largeDepositRate = self.interestRate;
		var amount = self.amount;
		
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
       	document.getElementById("largeDepositPeriod").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_PERIOD',largeDepositPeriod);
 		document.getElementById("largeDepositRate").innerText = parseFloat(largeDepositRate).toFixed(4) +'%';
 		document.getElementById("amount").innerText = format.formatMoney(amount) +'元';
		
		if(plus.webview.getWebviewById("largeDepositHome")){
        	mui.fire(plus.webview.getWebviewById("largeDepositHome"), 'reload', {});
        }
        var muiBack = mui.back;
		document.getElementById("backBtn").addEventListener("tap",function(){
			mbank.back('largeDepositHome',muiBack);
		},false);
		mui.back=function(){
			mbank.back('largeDepositHome',muiBack);
		}
	});
});