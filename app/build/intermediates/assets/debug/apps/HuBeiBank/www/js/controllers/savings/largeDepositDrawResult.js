define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var accountNo = self.accountNo;
		var productNo = self.productNo;
        var subAccountNo = self.subAccountNo;
        var currencyType = self.currencyType;
        var depositType = self.depositType;
        var savingPeriod = self.savingPeriod;
        var interestRate = self.interestRate;
        var interestBeginDate = self.interestBeginDate;
        var interestEndDate = self.interestEndDate;
        var balance = self.balance;
        var drawType = self.drawType;
        var drawAmount = self.drawAmount;
        var interest = self.interest;
        var principalAndInterest = self.principalAndInterest;
        var interestTax = self.interestTax;
        
        document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
        document.getElementById("subAccountNo").innerText = subAccountNo;
        document.getElementById("currencyType").innerText = jQuery.param.getDisplay('CURRENCY_TYPE',currencyType);
        document.getElementById("depositType").innerText = jQuery.param.getDisplay('TRANSFER_DEPOSIT_TYPE',productNo);
        document.getElementById("savingPeriod").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_PERIOD',savingPeriod);
        document.getElementById("interestRate").innerText = parseFloat(interestRate).toFixed(4) +'%';
        document.getElementById("interestBeginDate").innerText = format.dataToDate(interestBeginDate);
        document.getElementById("interestEndDate").innerText = format.dataToDate(interestEndDate);
        document.getElementById("balance").innerText = format.formatMoney(balance)+'元';
        document.getElementById("drawAmount").innerText = format.formatMoney(drawAmount)+'元';
        document.getElementById("interest").innerText = format.formatMoney(interest)+'元';
        document.getElementById("principalAndInterest").innerText = format.formatMoney(principalAndInterest)+'元';
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