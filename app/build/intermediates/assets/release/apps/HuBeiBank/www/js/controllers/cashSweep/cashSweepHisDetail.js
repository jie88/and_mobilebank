define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var beginDateVar = "";
	var endDateVar = "";
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
		}else if(status == '1'){
			status = '无效';
		}
		
		if(collectStyle == '0'){
			collectStyle = '保留金额';
		}else if(collectStyle == '1'){
			collectStyle = '固定金额';
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
		document.getElementById("collectAmt").innerHTML = format.formatMoney(collectAmt, 2) +'元';
		document.getElementById("status").innerHTML = status;
		
		var nDate = new Date();
		beginDateVar = format.prevMonth(nDate,1)+'000000';
		endDateVar = format.prevMonth(nDate,0)+'235959';
		
		document.getElementById("chooseBeginDate").innerText =beginDateVar.substring(0,4)+'-'+ beginDateVar.substring(4,6) + '-' + beginDateVar.substring(6,8);
		document.getElementById("chooseEndDate").innerText =endDateVar.substring(0,4)+'-'+ endDateVar.substring(4,6) + '-' + endDateVar.substring(6,8);
		$("#beginDate").on("tap",function(){
			chooseDate("chooseBeginDate");
		});
		$("#endDate").on("tap",function(){
			chooseDate("chooseEndDate");
		});
		function chooseDate(thisId){
			var nowDate = new Date();
			var dDate = new Date();
			var minDate = new Date();
			minDate.setFullYear(nowDate.getFullYear() - 1, nowDate.getMonth(), nowDate.getDate());
			var maxDate = new Date();
			maxDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			if(thisId == "chooseBeginDate"){
				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth()-1, nowDate.getDate());
			}else{
				dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			}
			plus.nativeUI.pickDate(function(e){
				var d=e.date;
				document.getElementById(thisId).innerText =d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
				if(thisId == "chooseBeginDate"){
					beginDateVar = format.ignoreChar(format.formatDate(d),'-')+'000000';
				}else{
					endDateVar = format.ignoreChar(format.formatDate(d),'-')+'235959';
				}
			}, function(e) {
				mui.alert("您没有选择日期","温馨提示");
			}, {
				date: dDate,
				minDate: minDate,
				maxDate: maxDate
			});
		}
		
		document.getElementById("submit").addEventListener("tap",function(){
			if(beginDateVar == '' || beginDateVar == null || beginDateVar == undefined || beginDateVar.length == 0){
				mui.alert('请选择起始日期',"温馨提示");
				return false;
			}
			if(endDateVar == '' || endDateVar == null || endDateVar == undefined || endDateVar.length == 0){
				mui.alert('请选择终止日期',"温馨提示");
				return false;
			}
			var range = format.dateRange(beginDateVar,endDateVar);
			if(range < 0){
				mui.alert('结束日期不能比开始日期小',"温馨提示");
				return;
			}else if(range >90){
				mui.alert('起止日期范围不能超过3个月',"温馨提示");
				return;
			}
			var params = {
				"orderFlowNo" : orderFlowNo,				
				"beginDate" : beginDateVar,
				"endDate" : endDateVar,							
				"noCheck" : false
			};
			mbank.openWindowByLoad('../cashSweep/cashSweepHisResult.html','cashSweepHisResult','slide-in-right',params);		
		});
	    mbank.resizePage(".btn_bg_f2");
	});
});