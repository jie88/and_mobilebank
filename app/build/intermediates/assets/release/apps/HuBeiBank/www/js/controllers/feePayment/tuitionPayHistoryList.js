define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	
	var self = "";
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
	var params = "";
	var urlVar = "";
	
	var areaNam ="";
	var areaNo ="";
	var unitNam ="";
	var unitNo ="";
	var batNo ="";
	var batSts ="";
	var payNo ="";
	var payStsList = {"a0":"缴费成功","a1":"未缴费","a2":"缴费失败"};
	
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				//contentrefresh : "正在刷新...",
				callback:pulldownfresh
			},
			up: {
				//contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	
	function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos = 1;
			//feePaymentHistoryList(1);
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = jQuery('#feePaymentList li').length;
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			//feePaymentHistoryList(turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		
		areaNam = self.AreaNam;
		areaNo = self.AreaNo;
		unitNam = self.UnitNam;
		unitNo = self.UnitNo;
		batNo = self.BatNo;
		batSts = self.BatSts;
		payNo = self.payNo;
		feePaymentHistoryList(1);
	});
	
	function feePaymentHistoryList(pageVar){
		document.getElementById("noContent").style.display="none";
		GapsQuery(pageVar);
	}
		
	function GapsQuery(pageVar){
		urlVar = mbank.getApiURL()+'003008_history_tuition.do';
		params = {
			"AreaNam": areaNam,
			"AreaNo" : areaNo,
			"UnitNam" : unitNam,
			"UnitNo" : unitNo,
			"BatNo" : batNo,
			"BatSts" : batSts,
			"payNo" : payNo,
			"turnPageBeginPos" : pageVar,
			"turnPageShowNum" :turnPageShowNum
		};
		mbank.apiSend("post",urlVar,params,gapsQuerySucFunc,gapsQueryFailFunc,true);
		function gapsQuerySucFunc(data){
			if(data.ec == "000"){
				var tutionHistoryList = data.tutionHistory;
		       /*	turnPageTotalNum = data.turnPageTotalNum;
			    if( turnPageBeginPos==1 ){
			       	jQuery("#tuitionList").empty();
			    }*/
		       	var	html="";
		       	if(tutionHistoryList.length>0){
		       		for(var i=0;i<tutionHistoryList.length;i++){
		       			var paySts = tutionHistoryList[i].PaySts;
		       			var Amt =  format.formatMoney(tutionHistoryList[i].payAmt, 2);
						html +='<li FeeNo="'+tutionHistoryList[i].FeeNo+'" payAmt="'+tutionHistoryList[i].payAmt+'" PaySts="'+tutionHistoryList[i].PaySts+'" FeeNam="'+tutionHistoryList[i].FeeNam+'">'
								+'<p class="color_6">缴费类型</p><p class="fz_15">'+tutionHistoryList[i].FeeNam+'</p>'
							    +'<div class="content_rbox" style="right:0px"><p class="color_red fz_16">¥'+Amt+'</p><p class="fz_12 color_9">'+payStsList["a"+paySts]+'</p></div>'
							    +'</li>';
			       	}
		       		//+'<a class="link_rbg2"></a>'
			       	jQuery("#tuitionList").append(html);
			       /*	mui("#tuitionList").on('tap','li',function(){
						//getDetail(this);
					});*/
		       	}else{
		       		if( turnPageBeginPos==1 ){
		       			document.getElementById("noContent").style.display="block";
				    }
		       	}
			}else{
				mui.alert(data.em,"温馨提示");
				return;
			}
		}
		function gapsQueryFailFunc(e){
			mui.alert(e.em,"温馨提示");
			return;
		}
	}
	
	
	
	/*function getDetail(target){
		params = {
			"FeeNo" : target.attributes["FeeNo"].nodeValue,
			"payAmt" : target.attributes["payAmt"].nodeValue,
			"PaySts" : target.attributes["PaySts"].nodeValue
		}
		mbank.openWindowByLoad('../feePayment/feePaymentHistoryDetail.html','feePaymentHistoryDetail','slide-in-right',params);
	}*/
});