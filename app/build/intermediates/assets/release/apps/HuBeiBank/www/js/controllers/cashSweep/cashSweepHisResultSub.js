define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum = 0;
    
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback : pulldownfresh,
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

	function pulldownfresh(){
		setTimeout(function() {
			turnPageBeginPos = 1;
			queryList();
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
		}, 800);
	}
	
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#fundCollectionList div').length;						
			if(currentNum >= turnPageTotalNum) { 				
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryList();
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum);
		}, 800);
	}
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.showWaiting("加载中...");
		var parentPage = plus.webview.getWebviewById("cashSweepHisResult");
		var orderFlowNo = parentPage.orderFlowNo;	
		var beginDate = parentPage.beginDate;
		var endDate = parentPage.endDate;
		
		queryList=function(){
			$("#showMsgDiv").empty();
			$("#showMsgDiv").hide();
			var params = {
				"orderFlowNo" : orderFlowNo,
				"beginDate" : beginDate,
				"endDate" : endDate,
				"turnPageBeginPos":turnPageBeginPos,
				"turnPageShowNum":turnPageShowNum
			};	
			var url = mbank.getApiURL() + 'queryFundAccFlow.do';
			mbank.apiSend('post', url , params, querySuc, queryError, true);
			function querySuc(data){
	    		turnPageTotalNum = data.turnPageTotalNum;
	    		var queryList = data.iQueryFundAccFlow;
				if( turnPageBeginPos==1 ){
			       	jQuery("#fundCollectionList").empty();
			    }
				var	html="";
				if(queryList.length>0){
					for(var i = 0; i < queryList.length; i++){
						var executeDate = queryList[i].executeDate; //转账执行时间
						var payAccount = queryList[i].payAccount; //被归集账号
						var transferAmt = queryList[i].transferAmt; //转账金额
						var recAccount = queryList[i].recAccount; //主账号
						var executeCode = queryList[i].executeCode; //处理结果码  90:成功， 99:失败  ，50：可疑。
						var executeMess = queryList[i].executeMess; //处理结果信息
						var result = "";
						var message = "";
						if(executeCode=="90"){
							result = "交易成功";
							message = "";
						}else if(executeCode=="50"){
							result = "状态可疑";
							message = "处理中..."
						}else{
							result = "交易失败";
							message = executeMess;
						}
						html +='<div class="backbox_fo m_bottom10px">';
						html +='<ul class="p_lr30px">';
						html +='<li><span class="detail_left">执行时间</span><span class="detail_right">'+format.formatDate(format.parseDate(executeDate, "yyyymmdd"))+'</span></li>';
						html +='<li><span class="detail_left">中心账号</span><span class="detail_right">'+format.dealAccountHideFour(recAccount)+'</span></li>';
						html +='<li><span class="detail_left">归集账号</span><span class="detail_right">'+format.dealAccountHideFour(payAccount)+'</span></li>';
						html +='<li><span class="detail_left">金额</span><span class="detail_right">'+format.formatMoney(transferAmt, 2) +'元</span></li>';
						html +='<li><span class="detail_left">执行结果</span><span class="detail_right">'+result+'</span></li>';
						if(executeCode!="90"){
							html +='<li><span class="detail_left">原因</span><span class="detail_right">'+message+'</span></li>';
						}
						html +='</ul>';
						html +='</div>';
					}
					jQuery("#fundCollectionList").append(html);
					$("#pullrefresh").show();
				}else{
					if( turnPageBeginPos==1 ){
						$("#pullrefresh").hide();
						$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
					    $("#showMsgDiv").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
					    $("#showMsgDiv").show();
				    }
				}
			}
			function queryError(e){
				plus.nativeUI.closeWaiting();
	    		$("#fundCollectionList").empty();
	    		$("#pullrefresh").hide();
	    		$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
		       	$("#showMsgDiv").append('<p class="fz_15 text_m">' + data.em + ' </p>');
		       	$("#showMsgDiv").show();
			}
		}
				
        queryList(1);
        
	});
});
