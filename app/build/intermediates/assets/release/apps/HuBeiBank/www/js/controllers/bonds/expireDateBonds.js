define(function(require, exports, module) {
	var doc = document;
	var m = mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	var turnPageBeginPos=1;
    var turnPageShowNum=5;
    var turnPageTotalNum;

	m.init({
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
		expireDateBondsQuery(1);	
		m('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
		m('#pullrefresh').pullRefresh().enablePullupToRefresh();
		m('#pullrefresh').pullRefresh().refresh(true);
		m('#pullrefresh').pullRefresh().endPullupToRefresh();
		}, 800);
    }

 	function pullupRefresh(){
		setTimeout(function() {
			var currentNum = $('#expireDateBonds ul').length;
			if(currentNum >= turnPageTotalNum) { //无数据时，事件处理
				m('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		    turnPageBeginPos = turnPageBeginPos + turnPageShowNum;
			expireDateBondsQuery(turnPageBeginPos);
			m('#pullrefresh').pullRefresh().endPullupToRefresh(turnPageBeginPos>= turnPageTotalNum); //参数为true代表没有更多数据了。
		}, 800);
    } 
    
	m.plusReady(function() {
		plus.nativeUI.showWaiting("加载中...");
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();	
		
		var currentDate = new Date();
		var year = currentDate.getFullYear();
		var month = currentDate.getMonth() + 1 < 10 ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1;
		var day = currentDate.getDate() < 10 ? "0" + currentDate.getDate(): currentDate.getDate();
		var dateStr = year.toString()  + month.toString()  + day.toString();
		var customerId = localStorage.getItem("session_mobileNo");//绑定网银客户号改为手机号--modify by 2017-05-15
		var pageBondsList = [];
		
		
		expireDateBondsQuery = function(beginPos){
			plus.nativeUI.showWaiting("加载中...");
			var dataNumber = {
				turnPageBeginPos : turnPageBeginPos,
				turnPageShowNum : turnPageShowNum,
				ibiEffectiveDateBegin: dateStr,
				ibiEffectiveDateEnd: dateStr,
				ibiCustNo: customerId
				//查询的条件
			};
			var url = mbank.getApiURL() + 'expireDateBondsQuery.do';
			mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
			function successCallback(data){
				turnPageTotalNum = data.turnPageTotalNum;
		       	if( beginPos == 1 ){
		       	   	$("#expireDateBonds").empty();
		       	}
				var html = '';
				var expireDateBondsList = data.bondsList;
				if (expireDateBondsList.length == 0) {
					html = '<div class="fail_icon1 suc_top7px"></div>';
					html += '<p class="fz_15 text_m">无已到期票券！</p>';
//					$("#expireDateBonds").html(html);
//					$("#showMsgDiv").html(html);
//					$("#showMsgDiv").show();
//					$("#pullrefresh").hide();
					m('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
					return;
				}
				for(var i = 0; i < expireDateBondsList.length; i++){
					var ibiBondsId = expireDateBondsList[i].ibiBondsId;//记录编号
					var ibiBondsNo = expireDateBondsList[i].ibiBondsNo;//票券编号
					var ibiBranchNo = expireDateBondsList[i].ibiBranchNo;//批次号
					var ibiBondsType = expireDateBondsList[i].ibiBondsType;//票券类型（1、满减券；2抵用券；3、兑换券）
					var ibiBondsSize = expireDateBondsList[i].ibiBondsSize;//票券面额
					var ibiBondsUnit = expireDateBondsList[i].ibiBondsUnit;//票券单位
					var ibiBrokerNo = expireDateBondsList[i].ibiBrokerNo;//券商编号
					var ibiBrokerId = expireDateBondsList[i].ibiBrokerId;//券商信息id（关联IM_MOBILE_BANK_BROKER_INFO表）
					var ibiEffectiveDateBegin = expireDateBondsList[i].ibiEffectiveDateBegin;//有效期（yyyymmdd）开始
					var ibiEffectiveDateEnd = expireDateBondsList[i].ibiEffectiveDateEnd;//有效期（yyyymmdd）截止日期
					var ibiUpdateDate = expireDateBondsList[i].ibiUpdateDate;//票券更新时间
					var ibiProvideNo = expireDateBondsList[i].ibiProvideNo;//发放票券人工号 
					var ibiProvideDate = expireDateBondsList[i].ibiProvideDate;//发放时间
					var ibiCustNo = expireDateBondsList[i].ibiCustNo;//网银客户号（用于票券和用户的绑定）
					
					var ibiBrokerName = expireDateBondsList[i].ibiBrokerName;//券商名称 
					var ibiBondsTitle = expireDateBondsList[i].ibiBondsTitle;//票券标题（列表展示用）
					var ibiBondsDesc = expireDateBondsList[i].ibiBondsDesc;//票券描述（列表展示用）
					var ibibrokerLogoAdd = expireDateBondsList[i].ibibrokerLogoAdd;//券商logo地址 
					var ibiBrokerAdd = expireDateBondsList[i].ibiBrokerAdd;//票券使用地址
					var ibiBondsDetailTitle1 = expireDateBondsList[i].ibiBondsDetailTitle1;//票券详细情况标题（详情页面用）
					var ibiBondsDetailDesc1 = expireDateBondsList[i].ibiBondsDetailDesc1;//票券详细情况描述（详情页面用） 
					var ibiBondsDetailTitle2 = expireDateBondsList[i].ibiBondsDetailTitle2;//票券详细情况标题（详情页面用）
					var ibiBondsDetailDesc2 = expireDateBondsList[i].ibiBondsDetailDesc2;//票券详细情况描述（详情页面用）
					var ibiBondsDetailTitle3 = expireDateBondsList[i].ibiBondsDetailTitle3;//票券详细情况标题 （详情页面用）
					var ibiBondsDetailDesc3 = expireDateBondsList[i].ibiBondsDetailDesc3;//票券详细情况描述
					var ibiInsertDate = expireDateBondsList[i].ibiInsertDate;//新增时间
					var ibiUpdataDate = expireDateBondsList[i].ibiUpdataDate;//更新时间
					var ibiInsertUserNo = expireDateBondsList[i].ibiInsertUserNo;//新增操作员工号
					var ibiUpdateUserNo = expireDateBondsList[i].ibiUpdateUserNo;//修改操作员工号
					
					var ibiEffectiveDateBegin = format.dataToDate(ibiEffectiveDateBegin);//格式化日期，把YYYYMMDD转换YYYY-MM-DD
					var ibiEffectiveDateEnd = format.dataToDate(ibiEffectiveDateEnd);//格式化日期，把YYYYMMDD转换YYYY-MM-DD
					
					var ibiBondsSizeShow;
					var ibiBondsTypeShow;
					if(ibiBondsType == 3){
						ibiBondsSizeShow = ibiBondsSize + ibiBondsUnit;
						ibiBondsTypeShow = '兑换券';
					}else if(ibiBondsType = 2){
						ibiBondsSizeShow = '¥' + ibiBondsSize;
						ibiBondsTypeShow = '抵用券';
					}else if(ibiBondsType = 1){
						ibiBondsSizeShow = '¥' + ibiBondsSize;
						ibiBondsTypeShow = '满减券';
					}
//					var params = {
//						ibiBondsNo : ibiBondsNo,
//						ibiBrokerId: ibiBrokerId,
//						ibiBrokerNo: ibiBrokerNo,
//						ibiBondsTypeShow : ibiBondsTypeShow,
//						ibiBondsSizeShow : ibiBondsSizeShow,
//						ibiBondsType : ibiBondsType,
//						ibiBondsSize : ibiBondsSize,
//						ibiBondsUnit : ibiBondsUnit,
//						ibiBranchNo: ibiBranchNo,
//						ibiEffectiveDateBegin: ibiEffectiveDateBegin,
//						ibiEffectiveDateEnd: ibiEffectiveDateEnd,
//						ibiBrokerName: ibiBrokerName,
//						ibiBondsTitle: ibiBondsTitle,
//						ibiBondsDesc: ibiBondsDesc,
//						ibiBrokerAdd: ibiBrokerAdd,
//						ibiBrokerAdd: ibiBrokerAdd,
//						ibiBondsDetailTitle1: ibiBondsDetailTitle1,
//						ibiBondsDetailDesc1: ibiBondsDetailDesc1,
//						ibiBondsDetailTitle2: ibiBondsDetailTitle2,
//						ibiBondsDetailDesc2: ibiBondsDetailDesc2,
//						ibiBondsDetailTitle3: ibiBondsDetailTitle3,
//						ibiBondsDetailDesc3: ibiBondsDetailDesc3,
//						ibibrokerLogoAdd: ibibrokerLogoAdd
//					};
//					var paramStr = JSON.stringify(params);

					//分页处理
					var index = beginPos - 1 + i;
					pageBondsList[index] = expireDateBondsList[i];
					
			    	if(i%2 != 0){
			    		html+='<ul class="backbox_th h_90px border_gray m_top10px">';
			    		html+='<li class="liDetail bond_bg_sing_g" index=' + index + '></li>';
			    	}else{
			    		html+='<ul class="backbox_th h_90px border_y m_top10px">';
			      		html+='<li class="liDetail bond_bg_sing_y" index=' + index + '></li>';
			    	}
			    	if(ibiBondsType == 3){
						html+='<li class="liDetail bond_Lbox" index=' + index + '><p class="bond_icon">' + ibiBondsTypeShow +'</p><p class="fz_16_r"><span class="fz_28 color_red">' + ibiBondsSize + ibiBondsUnit + '</span></p></li>';
					}else{
						html+='<li class="liDetail bond_Lbox" index=' + index + '><p class="bond_icon">' + ibiBondsTypeShow +'</p><p class="fz_16_r">¥<span class="fz_28 color_red">' + ibiBondsSize +'</span></p></li>';
			      	
					}
			      	html+='<li class="liDetail bond_Rbox m_left15px" index=' + index + '><p class="fz_16">'
			      	+ ibiBondsTitle + '</p><p class="color_6">' + ibiBondsDesc +
			      	'</p><p class="fz_12 color_9 m_top10px">有效期：' + ibiEffectiveDateEnd + '</p></li>';
			      	html+='<li class="deleteLi" id="delete" ibiBondsId=' + ibiBondsId + ' noCheck="false"><a class="delete_icon"><img src="../../img/delete_ico.png" /></a></li>';
					html+='</ul>';
				}
//				expireDateBonds.innerHTML = html;
				$("#expireDateBonds").append(html);
				m('#pullrefresh').pullRefresh().setStopped(false);//放开上下拉
				$(".liDetail").off().on('tap', function(){
					var _index = $(this).attr("index");
					showDetail(_index);
				});
				$(".deleteLi").off().on('tap', function(){
					var _ibiBondsId = $(this).attr("ibiBondsId");
					deleteBonds(_ibiBondsId);
				});
				plus.nativeUI.closeWaiting();
			}
			function errorCallback(e){
				plus.nativeUI.closeWaiting();
//		    	var html = '<div class="fail_icon1 suc_top7px"></div>';
		    	var html = '<div class="suc_top7px"></div>';
				html += '<p class="fz_18 text_m">' + e.em + '</p>';
				$("#expireDateBonds").html(html);
				m('#pullrefresh').pullRefresh().setStopped(true);//禁止上下拉
		   }
//			function errorCallback(e){
//		    	m.alert(e.em);
//		    }
		}
		turnPageBeginPos = 1;
		resetPullRefresh();
		expireDateBondsQuery(1);
		
		showDetail = function(_index){
			var params = {
		        paramStr: pageBondsList[_index],
	    		noCheck: "false"
	    	};
			mbank.openWindowByLoad('myBondsInfo.html','myBondsInfo','slide-in-right',params);
		}
		deleteBonds = function(bondsId){
			mui.confirm("您确定要删除此票券吗？","提示",["确定", "取消"], function(event) {	
		            if(event.index == 0){
		                var dataNumber = {
							ibiBondsId: bondsId,
							status: '0'  //改为‘0’不展示
						};
						var url = mbank.getApiURL() + 'changeBondsStatus.do';
						mbank.apiSend("post",url,dataNumber,successCallback,errorCallback,true);
						function successCallback(data){
							turnPageBeginPos = 1;
							resetPullRefresh();
							expireDateBondsQuery(turnPageBeginPos);
						}
						function errorCallback(e){
							m.alert(e.em);
					   }
		            }else{
		                return false;
		            }
		        }
		    )
		}
		
//		 window.addEventListener("swipe",function(e){
//	    	var direction=e.detail.direction;
//	    	//子页面向右滑动
//	    	if( direction=="left" ){
//	    		plus.webview.getWebviewById("expireDateBonds").show();
//	    		m.fire(self.parent(),"changeMenu",{pageId:"expireDateBonds"});
////	    		resetPullRefresh();
//	    	}
//	    	//子页面向左滑动
//	    	if( direction=="right" ){
//	    		plus.webview.getWebviewById("allBonds").show();
//	    		m.fire(self.parent(),"changeMenu",{pageId:"allBonds"});
////	    		resetPullRefresh();
//	    	}	    	
//	    });
	    
	    window.addEventListener("swiperight",function(e){
	    	plus.webview.getWebviewById("allBonds").show();
	    	plus.webview.getWebviewById("expireDateBonds").hide();
	    	m.fire(self.parent(),"changeMenu",{pageId:"allBonds"});
	    }); 
	    
	    //刷新列表
//		window.addEventListener("refreshNews", function(event) {
//			$("#expireDateBonds").empty();
//			turnPageBeginPos=1;
//			resetPullRefresh();
//			expireDateBondsQuery(turnPageBeginPos);
//		});
		
		function resetPullRefresh() {
			m('#pullrefresh').pullRefresh().endPulldownToRefresh();
			m('#pullrefresh').pullRefresh().refresh(true);
			m('#pullrefresh').pullRefresh().endPullupToRefresh();
			m('#pullrefresh').pullRefresh().refresh(true);
			m('#pullrefresh').pullRefresh().scrollTo(0,0);
		}
	    
	});
});