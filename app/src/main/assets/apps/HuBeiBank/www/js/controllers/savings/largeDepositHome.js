define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
	var url;
	var params;
    var currentAcct;
    
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
			turnPageBeginPos=1;	
			largeDepositQuery();	
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
			largeDepositQuery();
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    }
 	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		plus.nativeUI.showWaiting();
		largeDepositQuery=function(){
			document.getElementById('noContent').style.display = 'none';
			document.getElementById('pullrefresh').style.display = 'block';
			params = {
				"accountNo" : currentAcct,
				"productNo" : "041",
				"turnPageBeginPos":turnPageBeginPos,
				"turnPageShowNum":turnPageShowNum
			};
			url = mbank.getApiURL()+'largeDepositQuery.do';
			mbank.apiSend("post",url,params,querySuc,queryFail,true);
			function querySuc(data){
				plus.nativeUI.closeWaiting();
				if(data.ec =='000'){
					turnPageTotalNum=data.turnPageTotalNum;
					var queryList = data.iLargeDepositList;
					if( turnPageBeginPos==1 ){
			       		jQuery("#queryList").empty();
			    	}
					var	html="";
					if(queryList.length>0 && turnPageTotalNum >0){
						for(var i = 0; i < queryList.length; i++){
							var depositTypeName = jQuery.param.getDisplay("DESPOSIT_TYPE_NEW",queryList[i].productNo);
							var savingPeriodName = jQuery.param.getDisplay("PB_LARGEDEPOSIT_PERIOD",queryList[i].savingPeriod);
							html +='<ul class="bg_h113px m_top10px bg_br2px">';
							html +='<div class="goDetail" value="'+queryList[i].productNo+'|'+queryList[i].subAccountNo+'|'+queryList[i].currencyType+'|'+queryList[i].depositType+'|'+queryList[i].savingPeriod+'|'+queryList[i].interestRate+'|'+queryList[i].interestBeginDate+'|'+queryList[i].interestEndDate+'|'+queryList[i].balance+'">';
							html +='<li>';
							html +='<p class="sav_tit">'+depositTypeName+'<span class="sav_type">'+savingPeriodName+'</span></p>';
							html +='<a class="link_rbg link_top5px"></a>';
							html +='</li>';
							html +='<li class="money_box">';
							html +='<p class="pub_li_left m_left10px color_6">金额&nbsp;&nbsp;<span class="fz_17 color_red">￥'+format.formatMoney(queryList[i].balance,2)+'</span></p>';
							html +='<p class="pub_li_right_branch m_right5px m_top5px fz_12 color_9">到期&nbsp;'+format.dataToDate(queryList[i].interestEndDate)+'</p>';
							html +='</li>';
							html +='</div>';
							html +='<li class="pub_btnbox" value="'+queryList[i].productNo+'|'+queryList[i].subAccountNo+'|'+queryList[i].currencyType+'|'+queryList[i].depositType+'|'+queryList[i].savingPeriod+'|'+queryList[i].interestRate+'|'+queryList[i].interestBeginDate+'|'+queryList[i].interestEndDate+'|'+queryList[i].balance+'">';
							html +='<a class="sav_a depositDraw"><img src="../../img/icon19.png" /><span>存单支取</span></a>';
							html +='<a class="sav_a depositDetail"><img src="../../img/icon10.png" /><span>账户明细</span></a>';
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
					if(turnPageBeginPos ==1){
						document.getElementById('msgSpan').innerText = data.em;
						document.getElementById('pullrefresh').style.display = 'none';
						document.getElementById('noContent').style.display = 'block';
					}else{
						mui.alert(data.em);
					}
				}
			}
			function queryFail(e){
				plus.nativeUI.closeWaiting();
				if(turnPageBeginPos ==1){
					document.getElementById('msgSpan').innerText = e.em;
					document.getElementById('pullrefresh').style.display = 'none';
					document.getElementById('noContent').style.display = 'block';
				}else{
					mui.alert(e.em);
				}
			}
		}
		
		mui('#queryList').on('tap','.depositDraw',function(event) {
			var value = this.parentNode.getAttribute('value').split('|');
			params = {
				"accountNo" : currentAcct,
				"productNo" : value[0],
				"subAccountNo" : value[1],
				"currencyType" : value[2],
				"depositType" : value[3],
				"savingPeriod" : value[4],
				"interestRate" : value[5],
				"interestBeginDate" : value[6],
				"interestEndDate" : value[7],
				"balance" : value[8]
			};
			mbank.openWindowByLoad("../savings/largeDepositDrawInput.html","largeDepositDrawInput", "slide-in-right",params);
		});
		mui('#queryList').on('tap','.depositDetail',function(event) {
      		var value = this.parentNode.getAttribute('value').split('|');
			params = {
				"accountNo" : currentAcct,
				"productNo" : value[0],
				"subAccountNo" : value[1],
				"currencyType" : value[2],
				"depositType" : value[3],
				"savingPeriod" : value[4],
				"interestRate" : value[5],
				"interestBeginDate" : value[6],
				"interestEndDate" : value[7],
				"balance" : value[8]
			};
			mbank.openWindowByLoad("../savings/largeDepositDetail.html","largeDepositDetail", "slide-in-right",params);
		});
		mui('#queryList').on('tap','.goDetail',function(event) {
      		var value = this.getAttribute('value').split('|');
			params = {
				"accountNo" : currentAcct,
				"productNo" : value[0],
				"subAccountNo" : value[1],
				"currencyType" : value[2],
				"depositType" : value[3],
				"savingPeriod" : value[4],
				"interestRate" : value[5],
				"interestBeginDate" : value[6],
				"interestEndDate" : value[7],
				"balance" : value[8]
			};
			mbank.openWindowByLoad("../savings/largeDepositDetail.html","largeDepositDetail", "slide-in-right",params);
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
				var accountPicker = new mui.SmartPicker({title:"请选择付款账户",fireEvent:"accountChange"});
				accountPicker.setData(accountPickerList);
					
				currentAcct = iAccountList[0].accountNo;
				document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
				largeDepositQuery();
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
		}
		window.addEventListener("accountChange",function(event){
			currentAcct = event.detail.value;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
			turnPageBeginPos=1;
            largeDepositQuery();
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
        });
        
        window.addEventListener("reload",function(event){
        	turnPageBeginPos=1;
            largeDepositQuery();
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 	
			mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		});
        
        
        document.getElementById("largeDeposit").addEventListener("tap",function(){
        	params = {
        		"accountNo" : currentAcct,
        		"noCheck" : "false"
        	};
        	mbank.openWindowByLoad('../savings/largeDepositProList.html','largeDepositProList','slide-in-right',params);
		},false);
        
        mbank.resizePage(".btn_bg_f2");
        
	});

});
