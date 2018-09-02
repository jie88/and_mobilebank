define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var userInfo = require('../../core/userInfo');
	
    var self;
	var params;
	var url;
	
	var turnPageBeginPos = 1;
    var turnPageShowNum = 10;
    var turnPageTotalNum;
	
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
		setTimeout(function() {
			turnPageBeginPos = 1;
			queryList();
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
	}
	
	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = jQuery('#queryList ul').length;
			if(currentNum >= turnPageTotalNum) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			queryList();
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos >= turnPageTotalNum);
		}, 800);
	}
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.closeWaiting();
		var self = plus.webview.currentWebview();
		var parentPage = plus.webview.getWebviewById('largeDepositProList');
		var accountNo = parentPage.accountNo;
		//列表加载
		queryList = function(){
			document.getElementById('noContent').style.display = 'none';
			document.getElementById('pullrefresh').style.display = 'block';
			params = {
				"turnPageBeginPos" : turnPageBeginPos,
				"turnPageShowNum" : turnPageShowNum
			};
			url = mbank.getApiURL() + 'largeDepositProQuery.do';
			mbank.apiSend("post",url,params,queryListSuc,queryListFail,true);
			function queryListSuc(data){
				if(data.ec == "000"){
					var queryList = data.iLargeDepositProList;
					turnPageTotalNum = data.turnPageTotalNum;
					if( turnPageBeginPos==1 ){
			       		jQuery("#queryList").empty();
			    	}
					var	html="";
					if(queryList.length>0){
						for(var i = 0; i < queryList.length; i++){
							html +='<ul class="bg_largedeposit bg_br2px m_top10px" value='+JSON.stringify(queryList[i])+'>';
							html +='<li class="loan_topbox" style="border-bottom:none">';
							html +='<p class="sav_tit">大额存单'+jQuery.param.getDisplay('PB_LARGEDEPOSIT_PERIOD',queryList[i].largeDepositPeriod)+'</p>';
							html +='<a class="link_rbg link_t40px"></a>';
							html +='</li>';
							html +='<li class="loan_timebox" style="margin-bottom: 10px;">';
							html +='<p><span class="fz_16 lineHeight25">'+(parseFloat(queryList[i].largeDepositStartAmt)/10000)+'万元</span><br/>起存金额</p>';
							html +='<p style="border-left:none"><span class="color_red fz_22 lineHeight25">'+parseFloat(queryList[i].largeDepositRate).toFixed(4)+'%</span><br/>利率</p>';
							html +='</li>';
							html +='</ul>';
						}
						jQuery("#queryList").append(html);
					}else{
						if( turnPageBeginPos==1 ){
		       				document.getElementById('msgSpan').innerText = '没有符合条件的记录';
							document.getElementById('pullrefresh').style.display = 'none';
							document.getElementById('noContent').style.display = 'block';
				    	}
					}
				}else{
					mui.alert(data.em);
				}
			}
			function queryListFail(e){
				mui.alert(e.em);
			}
		}
        
        queryList();
        
      	mui('#queryList').on('tap','ul',function(event) {
      		params = JSON.parse(this.getAttribute('value'));
      		params.accountNo = accountNo; 
			mbank.openWindowByLoad("../savings/largeDepositProDetail.html","largeDepositProDetail", "slide-in-right",params);
		});
        
	});
	
});