define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var myAcctInfo = require('../../core/myAcctInfo');
	
	var url;
	var params;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
		
		var largeDepositId = self.largeDepositId;
		var largeDepositName = self.largeDepositName;
		var largeDepositPeriod = self.largeDepositPeriod;
		var largeDepositRate = self.largeDepositRate;
		var largeDepositStartAmt = self.largeDepositStartAmt;
		var largeDepositEndAmt = self.largeDepositEndAmt;
		var largeDepositRateMode = self.largeDepositRateMode;
		var largeDepositWithdrawAD = self.largeDepositWithdrawAD;
		var largeDepositRateType = self.largeDepositRateType;
		var largeDepositIsAttorn = self.largeDepositIsAttorn;
		var largeDepositStartDate = self.largeDepositStartDate;
		var largeDepositEndDate = self.largeDepositEndDate;
		var largeDepositIsLimit = self.largeDepositIsLimit;
		var accountNo = self.accountNo;
		var amount;
		var balance;
		
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
        myAcctInfo.getAccBalance(accountNo,true,getBalSuc);
        function getBalSuc(data){
        	balance = data.balance;
        	document.getElementById("balance").innerText = format.formatMoney(balance) +'元';
        }
       	document.getElementById("largeDepositPeriod").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_PERIOD',largeDepositPeriod);
 		document.getElementById("largeDepositRate").innerText = parseFloat(largeDepositRate).toFixed(4) +'%';
 		document.getElementById("largeDepositStartAmt").innerText = (parseFloat(largeDepositStartAmt)/10000) +'万元';
 		document.getElementById("largeDepositEndAmt").innerText = (parseFloat(largeDepositEndAmt)/10000) +'万元';
 		
 		
 		document.getElementById("amount").addEventListener("focus",function(){
			if(document.getElementById('amount').value){
				document.getElementById('amount').value =format.ignoreChar(document.getElementById('amount').value,',');
			}
			document.getElementById('amount').setAttribute('type','number');
		},false);
		
		document.getElementById("amount").addEventListener("blur",function(){
			amount = document.getElementById('amount').value;
			if(!isValidMoney(amount)){
				document.getElementById('amount').value ='';
				return;
			}
			if(parseFloat(amount)<parseFloat(largeDepositStartAmt)){
				document.getElementById('amount').value ='';
				mui.alert("购买金额必须大于起存金额");
				return;
			}
			if(parseFloat(amount)>parseFloat(largeDepositEndAmt)){
				document.getElementById('amount').value ='';
				mui.alert("购买金额必须小于最大购买金额");
				return;
			}
			if(parseFloat(amount)>parseFloat(balance)){
				document.getElementById('amount').value ='';
				mui.alert("购买金额不能大于账户余额");
				return;
			}
			document.getElementById('amount').setAttribute('type','text');
			document.getElementById('amount').value =format.formatMoney(amount,2);
		},false);
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			amount = format.ignoreChar(document.getElementById('amount').value,',');
			if(!isValidMoney(amount)){
				document.getElementById('amount').value ='';
				mui.alert("请输入购买金额！");
				return;
			}
			if(parseFloat(amount)<parseFloat(largeDepositStartAmt)){
				return;
			}
			if(parseFloat(amount)>parseFloat(largeDepositEndAmt)){
				return;
			}
			if(parseFloat(amount)>parseFloat(balance)){
				return;
			}
			params = {
				"largeDepositId" : largeDepositId,
				"largeDepositName" : largeDepositName,
				"largeDepositPeriod" : largeDepositPeriod,
				"largeDepositRate" : largeDepositRate,
				"largeDepositStartAmt" : largeDepositStartAmt,
				"largeDepositEndAmt" : largeDepositEndAmt,
				"largeDepositRateMode" : largeDepositRateMode,
				"largeDepositWithdrawAD" : largeDepositWithdrawAD,
				"largeDepositRateType" : largeDepositRateType,
				"largeDepositIsAttorn" : largeDepositIsAttorn,
				"largeDepositStartDate" : largeDepositStartDate,
				"largeDepositEndDate" : largeDepositEndDate,
				"largeDepositIsLimit" : largeDepositIsLimit,
				"accountNo" : accountNo,
				"amount" : amount
			};
			mbank.openWindowByLoad("../savings/largeDepositSetConfirm.html","largeDepositSetConfirm", "slide-in-right",params);
		},false);
		
        
        mbank.resizePage(".btn_bg_f2");
	});

});
