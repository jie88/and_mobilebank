define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
		
		var state = self.state;
		var increRate;
		if(state =='0'){
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
		}else{
			pageInit();
		}
        
    function pageInit(){
        $("#subAccountNo").html(self.subAccountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
//      $("#accountStatus").html($.param.getDisplay("ACCOUNTNO_STATEBANK_TYPE",self.accountStat));
        $("#depositType").html($.param.getDisplay("DESPOSIT_TYPE_NEW",self.depositType)+$.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
//      $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#interestRate").html(self.interestRate+"%");
        $("#interestBeginDate").html(format.dataToDate(self.interestBeginDate));
        $("#interestEndDate").html(format.dataToDate(self.interestEndDate));
        $("#balance").html(format.formatMoney(self.balance,2));
        $("#transferSaveType").html($.param.getDisplay("TRANSFER_SAVE_TYPE",self.transferSaveType));
        if( "0"==self.transferSaveType ){
        	$("#transferSaveType").html("不转存");
        	
        } else {
        	if(self.transferSaveDays!=null&&self.transferSaveDays!=''){
				$("#transferSaveType").html("自动转存  "+$.param.getDisplay('SAVING_PERIOD_TYPE2',self.transferSaveDays));
			}
        }
        if(state =='0' && increRate){
        	document.getElementById('increRate').innerHTML = parseFloat(increRate).toFixed(4)+'%';
        	document.getElementById('increRateDiv').style.display ='block';
        }
    }
        $("#backButton").on("tap",function(){
        	self.close();
        });
        
	});

});
