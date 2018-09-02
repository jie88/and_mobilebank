define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var format = require('../../core/format');
    //当前选定账号
    var currentAcct = '';
    var turnPageBeginPos = 1;
    var turnPageShowNum = 10;
    var turnPageTotalNum = 0;
    
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback:pulldownfresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

	function pulldownfresh(){
		setTimeout(function(){
			turnPageBeginPos = 1;
			fundCollectionQuery();
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	
	function pullupRefresh(){
		setTimeout(function(){
			var currentNum = $('#fundCollectionList li').length;
			if(currentNum >= turnPageTotalNum){//无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			fundCollectionQuery();
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);//参数为true代表没有更多数据了。
		}, 800);
	}
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		fundCollectionQuery=function(){
			$("#showMsgDiv").empty();
			$("#showMsgDiv").hide();
			var url = mbank.getApiURL()+'queryFundAccountList.do';
			var param={
				'centerAccountNo':currentAcct,
				'turnPageBeginPos':turnPageBeginPos,
				'turnPageShowNum':turnPageShowNum	
			}
			mbank.apiSend("post",url,param,querySuccess,queryFail,false);
	    	function querySuccess(data){
	    		turnPageTotalNum = data.turnPageTotalNum;
	    		var queryList = data.iAddFundCollList;
				if( turnPageBeginPos==1 ){
			       	jQuery("#fundCollectionList").empty();
			    }
				var	html="";
				if(queryList.length>0){
					for(var i = 0; i < queryList.length; i++){
						var planDay = queryList[i].planDay;
						var planDuring = queryList[i].planDuring;
						var orderFlowNo = queryList[i].orderFlowNo;
						var payAccount = queryList[i].payAccount;	
						var status = queryList[i].status;
						if(status == '0'){
							status = '有效';
						}else if(status == '1'){
							status = '无效';
						}
						planDay = format.formatDate(format.parseDate(planDay, "yyyymmdd"));
						planDuring = format.formatDate(format.parseDate(planDuring, "yyyymmdd"));
				      	
				      	html+='<li value='+JSON.stringify(queryList[i])+'>';
					    html+='<div class="backbox_th m_top10px p_down10px ove_hid">';
					    html+='<a class="link_rbg link_t20px"></a>';
					    html+='<p class="p_top10px m_left10px fz_15">计划编号<span class="color_6">' + orderFlowNo + '</span></p>';
						html+='<div class="fund_cxlbbg_l">';
						html+='<p class="p_top10px m_left10px color_6">起始时间<span class="m_left10px">'+planDay+'</span></p>';
						html+='<p class="m_top5px m_left10px color_6">截止时间<span class="m_left10px">' + planDuring + '</span></p>';
						html+='</div>';				
						html+='<div class="fund_cxlbbg_r">';
						html+='<p class="p_top10px color_6">当前状态<span class="m_left10px">'+status+'</span></p>';				
						html+='<p class="m_top5px color_6">归集账号<span class="m_left10px">'+format.dealAccountHideThree(payAccount)+'</span></p>';
						html+='</div>';																									
				      	html+='</div>';
				      	html+='</li>';
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
	    	function queryFail(e){
	    		plus.nativeUI.closeWaiting();
	    		$("#fundCollectionList").empty();
	    		$("#pullrefresh").hide();
	    		if(e.ec == "3112"){
			       	$("#showMsgDiv").append('<p class="fz_15 text_m">未获取到客户签约信息 </p>');
	    		}else{
			       	$("#showMsgDiv").append('<div class="fail_icon1 suc_top7px"></div>');
			       	$("#showMsgDiv").append('<p class="fz_15 text_m">' + e.em + ' </p>');
	    		}
		       	$("#showMsgDiv").show();
		    } 			
		}
		
		mui('#fundCollectionList').on('tap','li',function(event) {
      		params = JSON.parse(this.getAttribute('value'));
      		params.noCheck = false;
			mbank.openWindowByLoad("../cashSweep/cashSweepManageDetail.html","cashSweepManageDetail", "slide-in-right",params);
		});
		
		loadAccountList();
		function loadAccountList(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				var iAccountList = data;
				var accountPickerList = [];
				for( var i=0;i<iAccountList.length;i++ ){
					var pickItem = {
						value:iAccountList[i].accountNo,
						text:iAccountList[i].accountNo
					};
					accountPickerList.push(pickItem);
				}
				var accountPicker = new mui.SmartPicker({title:"请选择账号",fireEvent:"accountChange"});
				accountPicker.setData(accountPickerList);
					
				currentAcct = iAccountList[0].accountNo;
				document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
				turnPageBeginPos = 1;
				fundCollectionQuery();
				
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
		}
		window.addEventListener("accountChange",function(event){
			currentAcct = event.detail.value;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
			turnPageBeginPos = 1;
			fundCollectionQuery();
        });	
		
		window.addEventListener("refreshFundCollection", function(event) {
			currentAcct = event.detail.value;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
			turnPageBeginPos = 1;
			fundCollectionQuery();
		});
		
	});
});