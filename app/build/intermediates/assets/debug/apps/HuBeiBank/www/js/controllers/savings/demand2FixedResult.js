define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
    var regularTreasureList = [];
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		//查询定期宝产品列表
		regularTreasureProQuery();
		function regularTreasureProQuery(){
	    	params = {
				"liana_notCheckUrl" : false
			};
			urlVar = mbank.getApiURL()+'regularTreasureProQuery.do';
			mbank.apiSend("post",urlVar,params,rtpQuerySuc,rtpQueryFail,true);
			function rtpQuerySuc(data){
				if(data.ec =='000'){
					regularTreasureList = data.iregularTreasureList;
					var rtFlag = false;
					if(regularTreasureList.length>0){
						for(var j=0;j<regularTreasureList.length;j++){
							if(regularTreasureList[j].savingPeriod == self.savingPeriod && parseFloat(self.amount)>=parseFloat(regularTreasureList[j].startAmount)){
								rtFlag =true;
								break;
							}
						}
					}
					if(rtFlag){
						document.getElementById('noSignDiv').style.display = 'none';
						document.getElementById('signDiv').style.display = 'block';
					}
				}else{
				}
			}
			function rtpQueryFail(e){
			}
	    }
        $("#accountNo").html(format.dealAccountHideFour(self.accountNo));
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#depositType").html($.param.getDisplay("TRANSFER_DEPOSIT_TYPE",self.depositType));
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD",self.savingPeriod));
        $("#interestRate").html(self.interestRate+"%");
        $("#amount").html(format.formatMoney(self.amount,2));
        var transferSaveType=self.transferSaveType;
        if( "1"==transferSaveType ){
        	$("#transferSaveType").html("是");
        	$("#transferSaveDays").html($.param.getDisplay("SAVING_PERIOD",self.transferSaveDays));
            $("#transferSaveDaysLi").show();
        }else{
        	$("#transferSaveType").html("否");
        	$("#transferSaveDaysLi").hide();
        }

		/*$("#confirmButton").on("tap",function(){
            mui.back();
		});
		
		//重写返回方法
		mui.back=function(){
			plus.webview.close("demand2FixedInput");
			plus.webview.close("demand2FixedConfirm");
			mui.fire(plus.webview.getWebviewById("demandFixed"),"reload",{});						
			plus.webview.close(self);	
		}*/ 		
		
	    
	    document.getElementById("signRTBtn").addEventListener("tap",function(){
			params = {
				"accountNo" : self.accountNo,
				"subAccountNo" : self.subAccountNo,
				"subAccountSerNo" : self.subAccountSerNo,
				"currencyType" : self.currencyType,
				"savingPeriod" : self.savingPeriod,
				"balance" : self.amount
			};
			mbank.openWindowByLoad('../savings/demandFixedToDqb.html','demandFixedToDqb','slide-in-right',params);
		},false);
		var muiBack = mui.back;
		document.getElementById("confirmButton").addEventListener("tap",function(){
			mui.fire(plus.webview.getWebviewById("demandFixed"),"reload",{});
			mbank.back('demandFixed',muiBack);
		},false);
		document.getElementById("backBtn").addEventListener("tap",function(){
			mui.fire(plus.webview.getWebviewById("demandFixed"),"reload",{});
			mbank.back('demandFixed',muiBack);
		},false);
		mui.back=function(){
			mui.fire(plus.webview.getWebviewById("demandFixed"),"reload",{});
			mbank.back('demandFixed',muiBack);
		}
		
	});

});