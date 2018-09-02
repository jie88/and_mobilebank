define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
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
		var amount = self.amount;
		var orderFlowNo;
		
		document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
       	document.getElementById("largeDepositPeriod").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_PERIOD',largeDepositPeriod);
 		document.getElementById("largeDepositRate").innerText = parseFloat(largeDepositRate).toFixed(4) +'%';
 		document.getElementById("amount").innerText = format.formatMoney(amount) +'元';
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			url = mbank.getApiURL()+'GetOrderFlowNo.do';
			mbank.apiSend("post",url,{},getFlowSuc,getFlowFail,true);
			function getFlowSuc(data){
				if(data.ec =="000"){
					orderFlowNo=data.orderFlowNo;
					params={
						"accountNo" : accountNo,
						"depositType" : "041",
						"savingPeriod" : largeDepositPeriod,
						"amount" : amount,
						"currencyType" : "01",
						"transferSaveType" : "0",//是否自动转存
						"interestRate" : largeDepositRate,
						"transferFlowNo" : orderFlowNo,
						"transferSaveDays" : "",
		         	};
	        		url = mbank.getApiURL()+'largeDepositSet.do';
			    	mbank.apiSend("post",url,params,largeDepositSetSuc,largeDepositSetFail,true);
				    function largeDepositSetSuc(data){
				    	if(data.ec =='000'){
				    		mbank.openWindowByLoad('../savings/largeDepositSetResult.html','largeDepositSetResult','slide-in-right',data);
				    	}else{
				    		mui.alert(data.em);
				    	}
				    }
				    function largeDepositSetFail(e){
				    	mui.alert(e.em);
				    }
				}else{
					mui.alert(data.em);
				}
			}
			function getFlowFail(e){
				 mui.alert(e.em);
			}
		},false);
		
        mbank.resizePage(".btn_bg_f2");
	});

});
