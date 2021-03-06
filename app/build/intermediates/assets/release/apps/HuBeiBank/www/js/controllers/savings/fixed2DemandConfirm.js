define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
		var state = self.state;//0表示是定期宝
		var msg = "";
		if(state =='0'){
			msg = "您此次支取是定期宝提前支取，提前支取利息按支取日央行同档基准利率计付，请确认是否支取？";
		}else{
			msg = "您此次支取是定期提前支取，支取金额的存款利息将按照活期利率计算，请确认是否支取？";
		}
        
        $("#subAccountNo").html(self.subAccountNo);
        $("#currencyType").html($.param.getDisplay("CURRENCY_TYPE",self.currencyType));
        $("#accountStatus").html($.param.getDisplay("ACCOUNTNO_STATEBANK_TYPE",self.accountStat));
        $("#depositType").html($.param.getDisplay("TRANSFER_DEPOSIT_TYPE",self.depositType));
        $("#savingPeriod").html($.param.getDisplay("SAVING_PERIOD_TYPE",self.savingPeriod));
        $("#interestRate").html(self.interestRate+"%");
        $("#interestBeginDate").html(format.dataToDate(self.interestBeginDate));
        $("#interestEndDate").html(format.dataToDate(self.interestEndDate));
        $("#balance").html(format.formatMoney(self.balance,2));
        $("#drawType").html($.param.getDisplay("DRAW_FLAG",self.drawType));
        if( self.drawType=="1" ){
        	$("#drawAmount").html(format.formatMoney(self.drawAmount,2));
        	$("#drawAmountLi").show();
        }
        
        $("#preStep").on("tap",function(){
        	self.close();
        });
        
        $("#confirmButton").on("tap",function(){
        	var sysDate=self.sysDate;
        	var interestEndDate=self.interestEndDate;
        	var transferSaveType=self.transferSaveType;
        	if( sysDate < interestEndDate ){
				mui.confirm(msg,"提示",["确认","取消"], function(e) {
				if (e.index == 0) {
					tranConfirm();	
				} });       		
        	}else{
        		url = mbank.getApiURL()+'queryHostSysDate.do';
				mbank.apiSend("post",url,{},hostSysDateSuc,hostSysDateFail,true);
				function hostSysDateSuc(data){
					if(data.ec =='000'){
						var hostSysDate = data.hostSysDate;
						if(hostSysDate < interestEndDate){
							mui.confirm(msg,"提示",["确认","取消"], function(e) {
							if (e.index == 0) {
								tranConfirm();	
							} });
						}else if(hostSysDate == interestEndDate){
							tranConfirm();
						}else{
							if(transferSaveType == '1'){
								mui.confirm(msg,"提示",["确认","取消"], function(e) {
								if (e.index == 0) {
									tranConfirm();	
								} });
							}else{
								tranConfirm();
							}
						}
					}else{
						mui.alert(data.em);
					}
				}
				function hostSysDateFail(e){
					mui.alert(e.em);
				}
        	}
        	function tranConfirm(){
	         	var params={
	         		accountNo:self.accountNo,
	         		subAccountNo:self.subAccountNo,
	         		drawType:self.drawType,
	         		drawAmount:self.drawAmount,
	         		currencyType:self.currencyType,
	         		depositType:self.depositType,
	         		savingPeriod:self.savingPeriod,
	         		balance:self.balance,
	         		subAccountSerNo:self.subAccountSerNo,
	         		transferSaveType:self.transferSaveType,
	         		transferSaveDays:self.transferSaveDays,
	         		interestBeginDate:self.interestBeginDate,
	         		interestEndDate:self.interestEndDate
	         	};
	        	var url = mbank.getApiURL()+'002004_timeToDemand.do';
			    mbank.apiSend("post",url,params,successCallback,errorCallback,true);
			    function successCallback(data){
			        mbank.openWindowByLoad('../savings/fixed2DemandResult.html','fixed2DemandResult','slide-in-right',data);
			    }
			    function errorCallback(data){
			    	dealFail(data);
			    }       		
        	}
        	
        });
 
	    function dealFail(data){
            mui.alert(data.em);
        }   
        
	});

});
