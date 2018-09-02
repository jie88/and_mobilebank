define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
		var accountNo = self.accountNo;
		var subAccountNo = self.subAccountNo;
		var subAccountSerNo = self.subAccountSerNo;
		var currencyType = self.currencyType;
		var savingPeriod = self.savingPeriod;
		var balance = self.balance;
		var interestBeginDate = self.interestBeginDate;
		var interestRate = self.interestRate;
		var increRate = self.increRate;
//		document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
//		document.getElementById('subAccountSerNo').innerText = subAccountSerNo;
//		document.getElementById('currencyType').innerText = jQuery.param.getDisplay("CURRENCY_TYPE",currencyType);
//		document.getElementById('savingPeriod').innerText = jQuery.param.getDisplay("SAVING_PERIOD_TYPE",savingPeriod);
//      document.getElementById('balance').innerText = format.formatMoney(balance,2) +'元';
//      document.getElementById('interestBeginDate').innerText = format.dataToDate(interestBeginDate);
        document.getElementById('interestRate').innerText = parseFloat(interestRate).toFixed(4)+'%';
        document.getElementById('increRate').innerText = parseFloat(increRate).toFixed(4)+'%'; 
        var muiBack = mui.back;
		document.getElementById("confirmButton").addEventListener("tap",function(){
			mui.fire(plus.webview.getWebviewById("demandFixed"),"reload",{});
			mbank.back('demandFixed',muiBack);
		},false);
		mui.back=function(){
			mui.fire(plus.webview.getWebviewById("demandFixed"),"reload",{});
			mbank.back('demandFixed',muiBack);
		}
	});
});
