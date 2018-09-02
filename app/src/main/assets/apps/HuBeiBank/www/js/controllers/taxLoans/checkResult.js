define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var nativeUI = require('../../core/nativeUI');
	
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		var applyMoney = self.applyMoney;
		var loanDate = self.loanDate;
		var payType = self.payType;
		var useType = self.useType;
		var accountNo = self.accountNo;
		var organization = self.organization;
		var applyArea = self.applyArea;
		var commendNo = self.commendNo;
		var creditNo = self.creditNo;
		var registerNo = self.registerNo;
		var checkNo = self.checkNo;
		var organizationNo = self.organizationNo;
		
		var Num = 500000;
        var timestep = 10;
        var timerID = null;
        var interval = Num/100;
        
        $("#limit").html("0.00");
        $("#limit2").html("0.00");
        num = function() {
        	timerID = setTimeout("num()", 20); 
            if (Number($("#limit2").html()) >= Num) {
                clearTimeout(timerID)
            }
            else{
            	$("#limit2").html(  Number($("#limit2").html()) + interval );
            	console.log("++++++++++++++"+$("#limit2").html())
            	$("#limit").html(  format.formatMoney( $("#limit2").html() ) );
            }
                
        }
        num();
		setTimeout(function(){
			$("#contentTwo").html("贷款审批通过");
			$("#content").html("审批额度:"+$("#limit").html());
		},3200);
		$("#next").on('tap',function(){
			var params = {
				applyMoney: applyMoney,
				loanDate: loanDate,
				payType: payType,
				useType: useType,
				accountNo : accountNo,
				organization : organization,
				applyArea : applyArea,
				creditNo : creditNo,
				commendNo : commendNo,
				registerNo : registerNo,
				checkNo : checkNo,
				organizationNo : organizationNo,
				noCheck : false
			};
			/*nativeUI.showWaiting();
			setTimeout(function(){
				mbank.openWindowByLoad('../faxLoans/firmIdCheck.html','firmIdCheck','slide-in-right',params);
				nativeUI.closeWaiting();
			},2000);*/
			mbank.openWindowByLoad('../taxLoans/signOnline.html','signOnline','slide-in-right',params);
			
		});
		mbank.resizePage('.btn_bg_f2');
	});
});