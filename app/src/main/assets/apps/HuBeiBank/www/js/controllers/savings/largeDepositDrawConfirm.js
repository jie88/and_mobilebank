define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	var url;
	var params;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
		var msg = '您此次支取是提前支取，支取金额的存款利息将按照活期利率计算，请确认是否支取？';
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
        
        document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
        document.getElementById("subAccountNo").innerText = subAccountNo;
        document.getElementById("currencyType").innerText = jQuery.param.getDisplay('CURRENCY_TYPE',currencyType);
        document.getElementById("depositType").innerText = jQuery.param.getDisplay('TRANSFER_DEPOSIT_TYPE',productNo);
        document.getElementById("savingPeriod").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_PERIOD',savingPeriod);
        document.getElementById("interestRate").innerText = parseFloat(interestRate).toFixed(4) +'%';
        document.getElementById("interestBeginDate").innerText = format.dataToDate(interestBeginDate);
        document.getElementById("interestEndDate").innerText = format.dataToDate(interestEndDate);
        document.getElementById("balance").innerText = format.formatMoney(balance)+'元';
        document.getElementById("drawType").innerText = jQuery.param.getDisplay('DRAW_FLAG',drawType);
        if(drawType=="1" ){
        	document.getElementById("drawAmount").innerText = format.formatMoney(drawAmount)+'元';
        	document.getElementById("drawAmountLi").style.display = 'block';
        }
        
        document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			url = mbank.getApiURL()+'getSystemTime.do';
			mbank.apiSend("post",url,{},getSysDateNowSuc,getSysDateNowFail,true);
			function getSysDateNowSuc(data){
				if(data.ec =='000'){
					var systemTime = data.systemTime;
					var sysDate = systemTime.substring(0,8);
					if(sysDate < interestEndDate ){
						mui.confirm(msg,"温馨提示",["确认", "取消"], function(event) {
							if (event.index == 0) {
								goSubmit();
							}else{
								return;
							}
						});
		        	}else{
        				url = mbank.getApiURL()+'queryHostSysDate.do';
						mbank.apiSend("post",url,{},hostSysDateSuc,hostSysDateFail,true);
						function hostSysDateSuc(data1){
							if(data1.ec =='000'){
								var hostSysDate = data1.hostSysDate;
								if(hostSysDate < interestEndDate){
									mui.confirm(msg,"温馨提示",["确认", "取消"], function(event) {
										if (event.index == 0) {
											goSubmit();
										}else{
											return;
										}
									});
								}else{
									goSubmit();
								}
							}else{
								mui.alert(data1.em);
							}
						}
						function hostSysDateFail(e1){
							mui.alert(e1.em);
						}
		        	}
				}else{
					mui.alert(data.em);
				}
			}
			function getSysDateNowFail(e){
				mui.alert(e.em);
			}
		},false);
		
		function goSubmit(){
			url = mbank.getApiURL()+'GetOrderFlowNo.do';
			mbank.apiSend("post",url,{},getFlowSuc,getFlowFail,true);
			function getFlowSuc(data){
				if(data.ec =="000"){
					orderFlowNo=data.orderFlowNo;
					params={
						"accountNo" : accountNo,
						"productNo" : productNo,
						"subAccountNo" : subAccountNo,
						"subAccountSerNo" : subAccountNo,
						"currencyType" : currencyType,
						"depositType" : depositType,
						"savingPeriod" : savingPeriod,
						"interestRate" : interestRate,
						"interestBeginDate" : interestBeginDate,
						"interestEndDate" : interestEndDate,
						"balance" : balance,
						"transferSaveType" : "0",
						"transferSaveDays" : "",
						"drawType" : drawType,
						"drawAmount" : drawAmount,
						"transferFlowNo" : orderFlowNo
		         	};
	        		url = mbank.getApiURL()+'largeDepositDraw.do';
			    	mbank.apiSend("post",url,params,largeDepositDrawSuc,largeDepositDrawFail,true);
				    function largeDepositDrawSuc(data1){
				    	if(data1.ec =='000'){
				    		mbank.openWindowByLoad('../savings/largeDepositDrawResult.html','largeDepositDrawResult','slide-in-right',data1);
				    	}else{
				    		mui.alert(data1.em);
				    	}
				    }
				    function largeDepositDrawFail(e){
				    	mui.alert(e.em);
				    }
				}else{
					mui.alert(data.em);
				}
			}
			function getFlowFail(e){
				 mui.alert(e.em);
			}
		}
		
		mbank.resizePage(".btn_bg_f2");
        
	});
});
