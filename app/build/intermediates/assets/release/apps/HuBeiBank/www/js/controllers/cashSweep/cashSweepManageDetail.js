define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();

		var orderFlowNo = self.orderFlowNo; //编号
		var payAccount = self.payAccount; //归集账号
		var payAccountName = self.payAccountName; //归集账户名
		var payAccountOpenBankName = self.payAccountOpenBankName; //被归集行名称
		var payAccountBkNo = self.payAccountBkNo;
		
		var centerAccountNo = self.recAccount;
		var recAccountName = self.recAccountName; //中心账号名
		
		var collectStyle = self.collectStyle;  //归集方式
		var collectAmt = self.collectAmt;  //归集金额
		var scheduleNo = self.scheduleNo; //归集日程
		var scheduleTime = self.scheduleTime; //归集周期内执行日
		var planDay = self.planDay; //起始日期
		var planDuring = self.planDuring;	 //终止日期			
		var status = self.status; //当前状态
		if(status == '0'){
			status = '有效';
			document.getElementById('stopService').removeAttribute('disabled');
			document.getElementById('updateSetting').removeAttribute('disabled');
		}else if(status == '1'){
			status = '无效';
			document.getElementById('collectAmt').setAttribute('readonly','readonly');
		}
		if(scheduleNo==1){
			scheduleTime = '每日';
		}else if(scheduleNo==3){
			scheduleTime = scheduleTime + '号';
		}else{
			scheduleTime = $.param.getDisplay("SHOW_DATAPLAN",scheduleTime);
		}
		document.getElementById("centerAccountNo").innerHTML = format.dealAccountHideFour(centerAccountNo);
		document.getElementById("recAccountName").innerHTML = recAccountName;
		document.getElementById("collectStyle").innerHTML = $.param.getDisplay("SHOW_COLLSTYLE",self.collectStyle);
		document.getElementById("scheduleNo").innerHTML = $.param.getDisplay("SHOW_PROCIRCLE",scheduleNo);
		document.getElementById("scheduleTime").innerHTML = scheduleTime;
		if(scheduleNo == '1'){
			document.getElementById('scheduleTimeDiv').style.display = 'none';
		}else{
			document.getElementById('scheduleTimeDiv').style.display = 'block';
		}
		document.getElementById("planDay").innerHTML = format.formatDate(format.parseDate(planDay, "yyyymmdd"));
		document.getElementById("planDuring").innerHTML = format.formatDate(format.parseDate(planDuring, "yyyymmdd"));
		
		document.getElementById("payAccount").innerHTML = format.dealAccountHideFour(payAccount);
		document.getElementById("payAccountName").innerHTML = payAccountName;
		document.getElementById("payAccountOpenBankName").innerHTML = payAccountBkNo;
		if(collectStyle == '0'){
			document.getElementById("amtTitle").innerHTML = '保底金额';
		}else{
			document.getElementById("amtTitle").innerHTML = '固定金额';
		}
		document.getElementById("collectAmt").value = format.formatMoney(collectAmt, 2);
		document.getElementById("status").innerHTML = status;
		
		
		document.getElementById("deleteCollect").addEventListener("tap",function(){
			mui.confirm("尊敬的客户,您确认删除此归集计划?","温馨提示",["确认", "取消"], function(event) {
				if (event.index == 0) {
					var param = {
						"orderFlowNo" : orderFlowNo,				
						"payAccount" : payAccount
					};
					var url = mbank.getApiURL()+'deleteFundAccount.do';
					mbank.apiSend("post",url,param,deleteSuc,deleteError,false);
			    	function deleteSuc(data){
			    		mui.fire(plus.webview.getWebviewById('cashSweepManageSub'),'refreshFundCollection',{value:centerAccountNo});
			    		mui.back();
			    	}
			    	function deleteError(e){
			    		mui.alert(e.em);
			    	}
				}else{
					return;
				}
			});
		});
		document.getElementById("stopService").addEventListener("tap",function(){
			mui.confirm("尊敬的客户,您确认终止此归集计划?","温馨提示",["确认", "取消"], function(event) {
				if (event.index == 0) {
					var param = {
						"orderFlowNo" : orderFlowNo,				
						"payAccount" : payAccount
					};
					var url = mbank.getApiURL()+'stopProtocol.do';
					mbank.apiSend("post",url,param,stopSuc,stopError,false);
			    	function stopSuc(data){
			    		mui.fire(plus.webview.getWebviewById('cashSweepManageSub'),'refreshFundCollection',{value:centerAccountNo});
			    		mui.back();
			    	}
			    	function stopError(e){
			    		mui.alert(e.em);
			    	}
				}else{
					return;
				}
			});
		});
		
		document.getElementById("updateSetting").addEventListener("tap",function(){
			var amt = document.getElementById('collectAmt').value;
			if(!amt){
				document.getElementById('collectAmt').value ='';
	        	mui.alert("请输入归集保底/固定金额");
				return;
			}
			amt=format.ignoreChar(amt,',');
			if(!isMoney(amt) || parseFloat(amt)<=0){
				document.getElementById('collectAmt').value ='';
	        	mui.alert("请输入合法的归集保底/固定金额");
				return;
			}
			var param = {
				'orderFlowNo' : orderFlowNo,				
				'payAccount' : payAccount,
				'collectAmt' : amt
			};
			var url = mbank.getApiURL()+'updateCollectAmt.do';
			mbank.apiSend("post",url,param,successCallback,errorCallback,false);
	    	function successCallback(data){
	    		mui.fire(plus.webview.getWebviewById('cashSweepManageSub'),'refreshFundCollection',{value:centerAccountNo});
			    mui.back();
	    	}
	    	function errorCallback(e){
	    		mui.alert(e.em);
	    	}
		});
		
	});
});