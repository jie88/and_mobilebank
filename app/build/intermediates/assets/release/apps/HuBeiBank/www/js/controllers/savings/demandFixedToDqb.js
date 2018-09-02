define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.showWaiting();
		var self=plus.webview.currentWebview();
		var accountNo = self.accountNo;
		var subAccountNo = self.subAccountNo;
		var subAccountSerNo = self.subAccountSerNo;
		var currencyType = self.currencyType;
		var savingPeriod = self.savingPeriod;
		var balance = self.balance;
		var increRate;
		queryRTIncreInfo();
		function queryRTIncreInfo(){
			var url = mbank.getApiURL()+'queryRTIncreInfo.do';
			mbank.apiSend("post",url,{},queryRTIncreInfoSuc,queryRTIncreInfoFail,true);
			function queryRTIncreInfoSuc(data){
				if(data.ec =='000'){
					increRate = data.increRate;
					pageInit();
				}else{
					pageInit();
				}
			}
			function queryRTIncreInfoFail(e){
				pageInit();
			}
		}
		
		function pageInit(){
			document.getElementById('accountNo').innerText = format.dealAccountHideFour(accountNo);
			document.getElementById('subAccountSerNo').innerText = subAccountSerNo;
			document.getElementById('currencyType').innerText = jQuery.param.getDisplay("CURRENCY_TYPE",currencyType);
			document.getElementById('savingPeriod').innerText = jQuery.param.getDisplay("SAVING_PERIOD_TYPE",savingPeriod);
	        document.getElementById('balance').innerText = format.formatMoney(balance,2) +'元';
			if(increRate){
				document.getElementById('increRate').innerHTML = parseFloat(increRate).toFixed(4)+'%';
        		document.getElementById('increRateDiv').style.display ='block';
			}
		}
        
        document.getElementById('preBtn').addEventListener('tap',function(){
        	mui.back();
        });
        document.getElementById('confirmButton').addEventListener('tap',function(){
        	var agreeCheck = document.getElementById('agreeCheck').checked;
			if(!agreeCheck){
				mui.alert("请阅读并同意《签约定期宝协议》");
				return false;
			}
        	params={
        		"accountNo" : accountNo,
				"subAccountNo" : subAccountNo,
				"subAccountSerNo" : subAccountSerNo,
				"currencyType" : currencyType
			};
			var url = mbank.getApiURL()+'signRegularTreasure.do';
			mbank.apiSend("post",url,params,confirmSuc,confirmFail,true);
			function confirmSuc(data){
				if(data.ec =='000'){
					params = {
						"accountNo" : accountNo,
						"subAccountNo" : subAccountNo,
						"subAccountSerNo" : subAccountSerNo,
						"currencyType" : currencyType,
						"savingPeriod" : savingPeriod,
						"balance" : balance,
						"interestBeginDate" : data.interestBeginDate,
						"interestRate" : data.interestRate,
						"increRate" : data.increRate,
						"noCheck" : "false"
					};
					mbank.openWindowByLoad("../savings/demandFixedToDqbResult.html","demandFixedToDqbResult", "slide-in-right",params);
				}else{
					mui.alert(data.em);
				}
			}
			function confirmFail(e){
				mui.alert(e.em);
			}
        });
        
        document.getElementById("dqbAgree").addEventListener("tap",function(){
			mbank.openWindowByLoad("../savings/demandFixedToDqbAgree.html","demandFixedToDqbAgree", "slide-in-right","");
		},false);
	});
});
