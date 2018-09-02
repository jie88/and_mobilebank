define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var myAcctInfo = require('../../core/myAcctInfo');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
	//当前选定账号
	var currentAcct="";
    var turnPageBeginPos=1;
    var turnPageShowNum=10;
    var turnPageTotalNum;
    var subAccountList=[];
    //定期宝产品列表
    var regularTreasureList =[];
    var sysDate;
    var sysDateLastDay;
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
		subAccountQuery(currentAcct,1);	
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 	
		mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		}, 800);
    }

 	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#subAccountList ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			subAccountQuery(currentAcct,turnPageBeginPos);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 


	mui.plusReady(function() {
		plus.nativeUI.showWaiting();
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();		
		subAccountQuery=function(accountNo,turnPageBeginPos){
			var url = mbank.getApiURL()+'fixedDepositListQuery.do';
			var param={
				actionFlag:"0",
				signFlag:"1",
				accountNo:accountNo,
				turnPageBeginPos:turnPageBeginPos,
				turnPageShowNum:turnPageShowNum	
			}
			mbank.apiSend("post",url,param,successCallback,errorCallback,true);
	    	function successCallback(data){
		       var iSubAccountInfo=data.iSubAccountInfo;
		       turnPageTotalNum=data.turnPageTotalNum;
		       if( turnPageBeginPos==1 ){
		       	   subAccountList=[];
		       	   $("#subAccountList").empty();
		       	   if( turnPageTotalNum=='0' ){
		       	       	 $("#subAccountList").append('<div class="fail_icon1 suc_top7px"></div>');
		       	       	 $("#subAccountList").append('<p class="fz_15 text_m">没有符合条件的记录</p>');
//		       	       	 mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		       	       	 return;
		       	   }
		       }
		       var	html="";
		       if( iSubAccountInfo.length>0 ){
		           for( var i=0;i<iSubAccountInfo.length;i++ ){
		           	    var subAccount=iSubAccountInfo[i]; 
		           	    subAccountList.push(subAccount);
		           	    var savingPeriod=subAccount.savingPeriod;
		           	    //0表示是定期宝，对应接口accLossStatus字段
		           	    if(subAccount.state =='0'){
							html+='<ul class="bg_h113px m_top10px bg_br2px1">';
						}else{
							html+='<ul class="bg_h113px m_top10px bg_br2px">';
						}
						var rtFlag = false;
						if(regularTreasureList.length>0 && subAccount.state !='0' && (sysDate == subAccount.interestBeginDate || sysDateLastDay == subAccount.interestBeginDate)){
							for(var j=0;j<regularTreasureList.length;j++){
								if(regularTreasureList[j].savingPeriod == subAccount.savingPeriod && parseFloat(subAccount.balance)>=parseFloat(regularTreasureList[j].startAmount)){
									rtFlag =true;
									break;
								}
							}
						}
						html+='<div class="goDetail" subAccountNo="'+subAccount.subAccountNo+'">';
						html+='<li>';	
						var depositTypeName=$.param.getDisplay("DESPOSIT_TYPE_NEW",subAccount.depositType);
						var savingPeriodName=$.param.getDisplay("SAVING_PERIOD_TYPE",subAccount.savingPeriod);
						/*if (subAccount.transferSaveType == "1") {
							html+='<p class="sav_tit">'+depositTypeName+'<span class="sav_type">'+savingPeriodName+'</span><span class="sav_type">转存</span></p>';
						} else{
							html+='<p class="sav_tit">'+depositTypeName+'<span class="sav_type">'+savingPeriodName+'</span><span class="sav_type">不转存</span></p>';
						}*/
						if(subAccount.state =='0'){
							html+='<p class="sav_tit">'+depositTypeName+'<span class="sav_type">定期宝</span><span class="sav_type">'+savingPeriodName+'</span></p>';
						}else{
							html+='<p class="sav_tit">'+depositTypeName+'<span class="sav_type">'+savingPeriodName+'</span></p>';
						}
						if (rtFlag) {
							html +='<span class="link_right" subAccountNo="'+subAccount.subAccountNo+'"><a><button class="toDqb">&nbsp;&nbsp;升级定期宝</button></a></span>';
						} else{
							html +='<span class="link_right" style="display: none;"><a><button class="toDqb">&nbsp;&nbsp;升级定期宝</button></a></span>';
						}
//						html+='<a class="link_rbg link_top5px"></a>';
						html+='</li>';
						html+='<li class="money_box" subAccountNo="'+subAccount.subAccountNo+'">';
						html+='<p class="pub_li_left m_left10px color_6">金额&nbsp;&nbsp;<span class="fz_17 color_red">￥'+format.formatMoney(subAccount.balance,2)+'</span></p>';
						html+='<p class="pub_li_right_branch m_right5px m_top5px fz_12 color_9">到期&nbsp;'+format.dataToDate(subAccount.interestEndDate)+'</p>';
						html+='</li>';
						html+="</div>";
						html+='<li class="pub_btnbox">';
						if (subAccount.depositType=="020") {
							html+='<a class="toFixed2Demand sav_a" subAccountNo="'+subAccount.subAccountNo+'"><img src="../../img/icon19.png" /><span>定转活</span></a>';
						} else{
							html+='<a class="sav_a"><img src="../../img/icon19_1.png" /><span class="color_ddd">定转活</span></a>';
						}
						html+='<a class="toSubDetail sav_a" subAccountNo="'+subAccount.subAccountNo+'"><img src="../../img/icon10.png" /><span>账户明细</span></a>';
						html+='</li>';
						html+='</ul>';
		           }
		           $("#subAccountList").append(html);

		          
		           //子账户明细
		            /*$(".goDetail").on("tap",function(){
		            	
		           	    var subAccountNo=$(this).attr("subAccountNo");
		   
			            var subAccount=getSubAccountBySubAccNo(subAccountNo);
			            if( null!=subAccount){
			            	mbank.openWindowByLoad('../savings/fixedSubAccountDetail.html','fixedSubAccountDetail','slide-in-right',subAccount);
			            }		           	    
		           });*/
		           $(".toSubDetail").on("tap",function(){
		           	    var subAccountNo=$(this).attr("subAccountNo");
			            var subAccount=getSubAccountBySubAccNo(subAccountNo);
			            if( null!=subAccount){
			            	mbank.openWindowByLoad('../savings/fixedSubAccountDetail.html','fixedSubAccountDetail','slide-in-right',subAccount);
			            }		           	    
		           });		
		           
		   
		           //定转活
		           $(".toFixed2Demand").on("tap",function(){
		           	    var subAccountNo=$(this).attr("subAccountNo");
			            var subAccount=getSubAccountBySubAccNo(subAccountNo);
			            if( null!=subAccount){
			            	subAccount.accountNo=currentAcct;
			            	mbank.openWindowByLoad('../savings/fixed2DemandInput.html','fixed2DemandInput','slide-in-right',subAccount);
			            }		           	    
		           });
		           
		           $(".link_right").on("tap",function(){
		           	    var subAccountNo=$(this).attr("subAccountNo");
			            var subAccount=getSubAccountBySubAccNo(subAccountNo);
			            if( null!=subAccount){
			            	subAccount.accountNo = currentAcct;
			            	mbank.openWindowByLoad('../savings/demandFixedToDqb.html','demandFixedToDqb','slide-in-right',subAccount);
			            }		           	    
		           });
		           plus.nativeUI.closeWaiting();
		       }
		    }
	    	function errorCallback(data){
	    		$("#subAccountList").empty();
		    	plus.nativeUI.closeWaiting();
		    	dealFail(data);
		    } 			
		}		
		
		
		
//		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#accountNo").html(format.dealAccountHideFour(currentAcct));
					subAccountQuery(currentAcct,1);
				}
			}
		}
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择账号",fireEvent:"pickAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();	
		});	
		
        window.addEventListener("pickAccount",function(event){
                var pickItem=event.detail;			
				currentAcct=iAccountInfoList[pickItem.value].accountNo;
				$("#accountNo").html(format.dealAccountHideFour(currentAcct));
				subAccountQuery(currentAcct,1);
        });			


		//根据子账户查询子账户对象
		getSubAccountBySubAccNo=function(subAccountNo){
            if( subAccountList!=null && subAccountList.length>0 ){
            	for( var i=0;i<subAccountList.length;i++ ){
            		var subAccount=subAccountList[i];
            		if( subAccount.subAccountNo==subAccountNo ){
            			return subAccount;
            		}
            	}
            }
			return null;
		}
		
		$("#demand2Fixed").on("tap",function(){
			var param={
				accountNo:currentAcct
			};
			mbank.openWindowByLoad('../savings/demand2FixedInput.html','demand2FixedInput','slide-in-right',param);
		});
		
        window.addEventListener("reload",function(event){
            subAccountQuery(currentAcct,1);
        });

	    function dealFail(data){
            mui.alert(data.em);
        }
	    //查询定期宝产品的列表
	    regularTreasureProQuery();
	    function regularTreasureProQuery(){
	    	plus.nativeUI.showWaiting();
	    	params = {
				"liana_notCheckUrl" : false
			};
			urlVar = mbank.getApiURL()+'regularTreasureProQuery.do';
			mbank.apiSend("post",urlVar,params,rtpQuerySuc,rtpQueryFail,true);
			function rtpQuerySuc(data){
				if(data.ec =='000'){
					regularTreasureList = data.iregularTreasureList;
					if(regularTreasureList.length>0){
						var dqbMsg = "&nbsp;&nbsp;";
						for(var k=0;k<regularTreasureList.length;k++){
							if(k>0){
								dqbMsg += ',';
							}
							dqbMsg += $.param.getDisplay("SAVING_PERIOD_TYPE2",regularTreasureList[k].savingPeriod)+'期';
						}
						dqbMsg +='定期宝额度在线，抓紧抢购吧!';
						document.getElementById('dqbMsg').innerHTML = dqbMsg;
						
						document.getElementById('topDiv').classList.remove('content_box5px');
						document.getElementById('topDiv').classList.add('m_top0');
						document.getElementById('listTop').classList.remove('m_top70px');
						document.getElementById('listTop').classList.add('m_top100');
						document.getElementById('dqbMsg').style.display = 'block';
						setTimeout(function() {
							document.getElementById('topDiv').classList.remove('m_top0');
							document.getElementById('topDiv').classList.add('content_box5px');
							document.getElementById('listTop').classList.remove('m_top100');
							document.getElementById('listTop').classList.add('m_top70px');
							document.getElementById('dqbMsg').style.display = 'none';
						}, 8000);
					}
					sysDate = data.sysDate;
					sysDateLastDay = format.prevDay(format.parseDate(sysDate),1);
					queryDefaultAcct();
				}else{
					queryDefaultAcct();
				}
			}
			function rtpQueryFail(e){
				queryDefaultAcct();
			}
	    }
	    
	    
	    /*window.addEventListener("swipeleft",function(e){
	    	if (Math.abs(e.detail.angle) > 170) {
		    	plus.webview.getWebviewById("demandFixed").hide();
		    	plus.webview.getWebviewById("notifyDeposit").show();
		    	plus.webview.getWebviewById("intelligentNotifyDeposit").hide();
		    	mui.fire(self.parent(),"changeMenu",{pageId:"notifyDeposit"});	    		
	    	}
	    });  */    
	    
	});

});
