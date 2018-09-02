define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	var url;
	var params;
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
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
		
		document.getElementById("largeDepositPeriod").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_PERIOD',largeDepositPeriod);
		document.getElementById("largeDepositStartAmt").innerText = (parseFloat(largeDepositStartAmt)/10000)+'万元';
		document.getElementById("largeDepositEndAmt").innerText = (parseFloat(largeDepositEndAmt)/10000)+'万元';
		document.getElementById("largeDepositRateMode").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_RATEMODE',largeDepositRateMode);
		document.getElementById("largeDepositRate").innerText = parseFloat(largeDepositRate).toFixed(4) +'%';
		document.getElementById("largeDepositWithdrawAD").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_WITHDRAW',largeDepositWithdrawAD);
		document.getElementById("largeDepositRateType").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_RATETYPE',largeDepositRateType);
		document.getElementById("largeDepositIsAttorn").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_ISATTORN',largeDepositIsAttorn);
		
		document.getElementById("beginDate").innerText = format.dataToDate(largeDepositStartDate);
		document.getElementById("endDate").innerText = format.dataToDate(largeDepositEndDate);

		if(largeDepositIsLimit =='0'){
			document.getElementById("nextButton").innerText = '已售罄';
		}else{
			document.getElementById("nextButton").innerText = '立即购买';
			document.getElementById("nextButton").removeAttribute("disabled");
		}
		
		
		document.getElementById("nextButton").addEventListener("tap",function(){
			url = mbank.getApiURL()+'getSysDateNow.do';
			mbank.apiSend("post",url,{},getSysDateNowSuc,getSysDateNowFail,true);
			function getSysDateNowSuc(data){
				if(data.ec =='000'){
					var sysDate = data.sysDate;
					if(sysDate < largeDepositStartDate){
						mui.alert("此大额存单还未到起购日期，不能进行购买");
						return;
					}else if(sysDate > largeDepositEndDate){
						mui.alert("此大额存单已到截止日期，不能进行购买");
						return;
					}else{
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
						};
						mbank.openWindowByLoad("../savings/largeDepositSetInput.html","largeDepositSetInput", "slide-in-right",params);
					}
				}else{
					mui.alert(data.em);
				}
			}
			function getSysDateNowFail(e){
				mui.alert(e.em);
			}
		},false);
		
		mbank.resizePage(".btn_bg_f2");
		
	});
});