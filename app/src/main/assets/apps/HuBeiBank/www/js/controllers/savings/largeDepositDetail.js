define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
		
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
		
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
        document.getElementById("subAccountNo").innerText = subAccountNo;
        document.getElementById("currencyType").innerText = jQuery.param.getDisplay('CURRENCY_TYPE',currencyType);
        document.getElementById("depositType").innerText = jQuery.param.getDisplay('TRANSFER_DEPOSIT_TYPE',productNo);
        document.getElementById("savingPeriod").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_PERIOD',savingPeriod);
        document.getElementById("interestRate").innerText = parseFloat(interestRate).toFixed(4) +'%';
        document.getElementById("interestBeginDate").innerText = format.dataToDate(interestBeginDate);
        document.getElementById("interestEndDate").innerText = format.dataToDate(interestEndDate);
        document.getElementById("balance").innerText = format.formatMoney(balance)+'元';
        
        document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
	});
});
