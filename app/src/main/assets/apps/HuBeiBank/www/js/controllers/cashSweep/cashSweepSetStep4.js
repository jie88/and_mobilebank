define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	var passwordUtil = require('../../core/passwordUtil');
	
    var iPayQueryList = [];//增加归集账户列表
    var iPayQueryListBak = [];//归集账户列表
    var accountPickerList = [];
    var accountPicker;
    var payAccountAry = "";//所选归集账户信息
    var payAccount = "";//归集账户
    var collectAmt = "";//固定归集金额
    
	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		commonSecurityUtil.initSecurityData('303061',self);
		
		var recAccount = self.recAccount;//中心账户
	    var collectStyle = self.collectStyle;//归集方式
	    var collectCircle = self.collectCircle;//归集周期 
	    var circleDAY = self.circleDAY;//周期内执行日
	    var protocolDate = self.protocolDate;//协议生效日期
	    var protocolDuring = self.protocolDuring;//协议期限
	    var protocolList = self.list;//归集账户集合
		//获取绑定账号列表及默认账号
		showDetail();
		
		function showDetail(){
			document.getElementById('recAccount').innerText = format.dealAccountHideFour(recAccount);
			document.getElementById('collectStyle').innerText = jQuery.param.getDisplay('SHOW_COLLSTYLE', collectStyle);
			document.getElementById('collectCircle').innerText = jQuery.param.getDisplay('SHOW_PROCIRCLE', collectCircle);
			if(collectCircle =="2"){
				document.getElementById('circleDAY').innerText = jQuery.param.getDisplay('SHOW_DATAPLAN', circleDAY);
				document.getElementById('tr_circleDAY').style.display = 'block';
			}else if(collectCircle =="3"){
				document.getElementById('circleDAY').innerText = circleDAY + "号";
				document.getElementById('tr_circleDAY').style.display = 'block';
			}
			document.getElementById('protocolDate').innerText = protocolDate;
			document.getElementById('protocolDuring').innerText = jQuery.param.getDisplay('SHOW_PRODURING', protocolDuring);
		}
		var html ="";
		$.each(protocolList,function(i){
			html+=getSureHtml(protocolList[i],i+1);
		});
		$("#payAccountList").append(html);
		//动态生成归集账户列表
		function  getSureHtml(list,index){
			var showId = "li_" + list[2];
			var html = "";
			html+='<li id='+ showId + '>'
		    	+'   <p class="fz_16"><span class="">'+index+'.</span>归集账户:'+list[2]+'</p>'
		    	+'   <p class="m_left15px color_9">户名:'+list[3]+'<span class="m_left10px color_9">归集账户余额:'+list[22]+'元</span></p>'
		    	+'   <p class="m_left15px color_9">开户行:'+list[5]+'<span class="m_left10px color_9">归集金额:'+list[17]+'元</span></p>'
			    +'</li>';	
			return html;
		}
        
        document.getElementById("prevButton").addEventListener("tap",function(){
			mui.back();
		},false);
        document.getElementById("nextButton").addEventListener("tap",function(){
			var params = {
				"iAddFundCollList.orderFlowNo":[],
				"iAddFundCollList.AthDealNo":[],
				"iAddFundCollList.QryDealNo":[],
				"iAddFundCollList.payAccount":[],
				"iAddFundCollList.payAccountName":[],
				"iAddFundCollList.payAccountOpenBankName":[],
				"iAddFundCollList.payAccountBkNo":[],
				"iAddFundCollList.recAccount":[],
				"iAddFundCollList.recAccountName":[],
				"iAddFundCollList.recAccountBkNo":[],
				"iAddFundCollList.session_customerId":[],
				"iAddFundCollList.collectStyle":[],
				"iAddFundCollList.collectAmt":[],
				"iAddFundCollList.scheduleNo":[],
				"iAddFundCollList.singleLimit":[],
				"iAddFundCollList.dayCntLimit":[],
				"iAddFundCollList.dayLimit":[],
				"iAddFundCollList.monthAmtLimit":[],
				"iAddFundCollList.monthCntLimit":[],
				"iAddFundCollList.beginDate":[],
				"iAddFundCollList.endDate":[],
				"iAddFundCollList.planDay":[],
				"iAddFundCollList.planDuring":[],
				"iAddFundCollList.feeAccount":[],
				"iAddFundCollList.FeeAmt":[],
				"iAddFundCollList.status":[],
				"iAddFundCollList.scheduleTime":[],
				"noCheck": true
			}
			for ( var i = 0; i < protocolList.length; i++) {
				params["iAddFundCollList.orderFlowNo"].push(protocolList[i][21]);
				params["iAddFundCollList.AthDealNo"].push(protocolList[i][0]);
				params["iAddFundCollList.QryDealNo"].push(protocolList[i][1]);
				params["iAddFundCollList.payAccount"].push(protocolList[i][2]);
				params["iAddFundCollList.payAccountName"].push(protocolList[i][3]);
				params["iAddFundCollList.payAccountOpenBankName"].push(protocolList[i][5]);
				params["iAddFundCollList.payAccountBkNo"].push(protocolList[i][4]);
				
				params["iAddFundCollList.recAccount"].push(protocolList[i][12]);
				params["iAddFundCollList.recAccountName"].push(protocolList[i][13]);
				params["iAddFundCollList.recAccountBkNo"].push(protocolList[i][15]);
				
				params["iAddFundCollList.session_customerId"].push(localStorage.getItem("session_customerId"));//获取客户号
				
				params["iAddFundCollList.collectStyle"].push(protocolList[i][18]);
				params["iAddFundCollList.collectAmt"].push(protocolList[i][17]);
				
				params["iAddFundCollList.scheduleNo"].push(protocolList[i][23]);//归集周期（每日，每周，每月）
				
				params["iAddFundCollList.singleLimit"].push(protocolList[i][6]);
				params["iAddFundCollList.dayCntLimit"].push(protocolList[i][7]);
				params["iAddFundCollList.dayLimit"].push(protocolList[i][16]);
				params["iAddFundCollList.monthAmtLimit"].push(protocolList[i][8]);
				params["iAddFundCollList.monthCntLimit"].push(protocolList[i][9]);
				params["iAddFundCollList.beginDate"].push(protocolList[i][10]);
				params["iAddFundCollList.endDate"].push(protocolList[i][11]);
				params["iAddFundCollList.planDay"].push(clearDateLine(protocolList[i][19]));
				params["iAddFundCollList.planDuring"].push(compareWithMon(protocolList[i][19],protocolList[i][20]));
				params["iAddFundCollList.status"].push(0);
				params["iAddFundCollList.scheduleTime"].push(protocolList[i][24]==null?"":protocolList[i][24]);
			}
		
			var url = mbank.getApiURL() + 'addFundCollAccount.do';
			commonSecurityUtil.apiSend("post",url,params,successCallback,errorCallback,false);//验证短信验证码
			function successCallback(data){
				mbank.openWindowByLoad('../cashSweep/cashSweepSetStep5.html','cashSweepSetStep5','slide-in-right',params);
			}
			function errorCallback(e){
				mui.alert(e.em);
				return;
			}
		},false);
	    
	    //把所有的非数字都清除，获得纯数字的日期
		function clearDateLine(dateString) {
			return dateString.replace(/[^\d]/g,'');
		}
		
	    function compareWithMon(date,month){  //按月
			var clearMon = "";
			var temp = date.split("-");
			var d =  new Date(temp[0],temp[1],temp[2]); 
		
			if(month=="0"){//永久
				return "";
			}else{				//1,3,6,12
				var mon = parseInt(d.getMonth())+parseInt(month)-1;
				d.setFullYear(d.getFullYear(),mon,d.getDate());
				var monStr = d.getMonth()<9?"0"+(d.getMonth()+1):monStr=d.getMonth()+1;
				var dateStr = d.getDate()<10?"0"+d.getDate():d.getDate();
				return d.getFullYear()+""+monStr+""+dateStr;
			}
	    }
	    
	    mbank.resizePage(".btn_bg_f2");
	});
});