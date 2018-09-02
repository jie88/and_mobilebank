define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	var url;
	var params;
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
        var drawType;
        var drawAmount;
        
        document.getElementById("accountNo").innerText = format.dealAccountHideFour(accountNo);
        document.getElementById("subAccountNo").innerText = subAccountNo;
        document.getElementById("currencyType").innerText = jQuery.param.getDisplay('CURRENCY_TYPE',currencyType);
        document.getElementById("depositType").innerText = jQuery.param.getDisplay('TRANSFER_DEPOSIT_TYPE',productNo);
        document.getElementById("savingPeriod").innerText = jQuery.param.getDisplay('PB_LARGEDEPOSIT_PERIOD',savingPeriod);
        document.getElementById("interestRate").innerText = parseFloat(interestRate).toFixed(4) +'%';
        document.getElementById("interestBeginDate").innerText = format.dataToDate(interestBeginDate);
        document.getElementById("interestEndDate").innerText = format.dataToDate(interestEndDate);
        document.getElementById("balance").innerText = format.formatMoney(balance)+'元';
        
        jQuery('input[name="drawType"]').on("change",function(){
            drawType = jQuery("input[name='drawType']:checked").val();
            if( drawType=="0" ){
            	document.getElementById("drawAmountLi").style.display = "none";
            }else{
            	document.getElementById("drawAmountLi").style.display = "block";
            }
        });
        
        document.getElementById("drawAmount").addEventListener("focus",function(){
			if(document.getElementById('drawAmount').value){
				document.getElementById('drawAmount').value =format.ignoreChar(document.getElementById('drawAmount').value,',');
			}
			document.getElementById('drawAmount').setAttribute('type','number');
		},false);
		
		document.getElementById("drawAmount").addEventListener("blur",function(){
			drawAmount = document.getElementById('drawAmount').value;
			if(!isValidMoney(drawAmount)){
				document.getElementById('drawAmount').value ='';
				return;
			}
			if(parseFloat(drawAmount)>parseFloat(balance)){
				document.getElementById('drawAmount').value ='';
				mui.alert("支取金额不能大于存单金额");
				return;
			}
			if(parseFloat(drawAmount) == parseFloat(balance)){
				document.getElementById('drawAmount').value ='';
				document.getElementById("drawAmountLi").style.display = "none";
				jQuery("input[name='drawType']").get(0).checked = true;
				jQuery("input[name='drawType']").get(1).checked = false;
				mui.alert("支取金额等于销户金额，请选择销户支取！");
				return;
			}
			document.getElementById('drawAmount').setAttribute('type','text');
			document.getElementById('drawAmount').value =format.formatMoney(drawAmount,2);
		},false);
		
		document.getElementById("preBtn").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextBtn").addEventListener("tap",function(){
			drawType=jQuery("input[name='drawType']:checked").val();
			if(drawType == '1'){
				drawAmount = format.ignoreChar(document.getElementById('drawAmount').value,',');
				if(!isValidMoney(drawAmount)){
					document.getElementById('drawAmount').value ='';
					mui.alert("请输入支取金额！");
					return;
				}
				if(parseFloat(drawAmount)>parseFloat(balance)){
					return;
				}
				if(parseFloat(drawAmount) == parseFloat(balance)){
					return;
				}
			}else{
				drawAmount = balance;
			}
			params={
				"accountNo" : accountNo,
				"productNo" : productNo,
				"subAccountNo" : subAccountNo,
				"currencyType" : currencyType,
				"depositType" : depositType,
				"savingPeriod" : savingPeriod,
				"interestRate" : interestRate,
				"interestBeginDate" : interestBeginDate,
				"interestEndDate" : interestEndDate,
				"balance" : balance,
				
				"drawType" : drawType,
				"drawAmount" : drawAmount
        	};
        	mbank.openWindowByLoad("../savings/largeDepositDrawConfirm.html","largeDepositDrawConfirm", "slide-in-right",params);
		},false);
        
        mbank.resizePage(".btn_bg_f2");
	});
});
