define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var userInfo = require('../../core/userInfo');
	var iAccountInfoList= [];
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		
		var idType = localStorage.getItem("session_certType");
		idType = $.param.getDisplay('CERT_TYPE_CREDIT',idType);
		var rmbAccount = $('#rmbAccount');
		var accountCount = 0;
		var contentData = plus.webview.currentWebview();
		var bFlag = contentData.pathFlag;
		var url = mbank.getApiURL() + 'cstInfoQuery.do';
		var bSupInd;
		if(bFlag=='0'){
			bSupInd = 'B';
		} else {
			bSupInd = 'S';
		}
		
		reload();
		function reload(){
			rmbAccount.empty();
			accountCount = 0;
			
			mbank.getAllAccountInfo(function(data){
			accountCount = data.length;
			iAccountInfoList = data;
			console.log(iAccountInfoList);
			for(var i=0;i<data.length;i++){
				var cardParam = {
					ProcCode:'cstinf',
					CardNo:data[i].accountNo
				};
				mbank.apiSend('post',url,cardParam,success,reportFail,true);
				
				function success(data){
					var basicSupp = data.BasicSuppFlag;
					//测试数据返回的主附标识为空 所以将null进行处理为主卡
					/*if(basicSupp==''||basicSupp==null||basicSupp=='B'){
						basicSupp='B';
					}*/
					if(basicSupp!=bSupInd){
						accountCount--;
					}
					var cardInfo = getCardInfo(data.CardNo);
					var name;
					if(cardInfo.accountAlias==null||cardInfo.accountAlias==""){
						name = userInfo.get("session_customerNameCN");
					} else {
						name = cardInfo.accountAlias;
					}
					showCardDetail(basicSupp,data.CardNo,name,data.CardStatus);
					
				}
			}
			},'6');
		}
		
		
		function showCardDetail(cardInfo,cardNo,name,status){
			
			if(accountCount>0){
				if(cardInfo==bSupInd){
					var ul = $('<ul class="bg_h160px bg_br2px m_top10px"></ul>');
					var li_account = $('<li></li>');
					var p_account = $('<P class="color_6 m_left10px m_top14px">账号&nbsp;&nbsp;<span class="fz_16">'+format.dealMoney(cardNo)+'</span>&nbsp;&nbsp;<span class="color_9">'+name+'</span></P>');
					var BasicSuppInd = $.param.getDisplay('BASIC_SUPPIND',cardInfo);//主附卡标识
					var p_type = $('<p class="owncard_type">'+BasicSuppInd+'</p>');
					li_account.append(p_account).append(p_type);
					
					var li_ava = $('<li class="own_money_box m_left10px"></li>');
					var p_one = $('<p ><span>可用额度</span><br /><span class="color_6 fz_12">币种／人民币</span></p>');
					var p_two = $('<p class="own_money" style="">'+
                        	'<span class="color_red">¥</span>'+
                        	'<span id="type'+cardNo+'" class="fz_18 color_red"></span>'+
                        '</p>');
                    getAvaiable(cardNo);
           			li_ava.append(p_one).append(p_two);
            		/*
            		 <a name="return"><span class="fz_12 color_9">还款</span><img src="../../img/icon15_1.png" /></a>
							<a name="bill"><span class="fz_12 color_9">未出账单</span><img src="../../img/icon14_1.png" /></a>
							<a name="emergencyLoss" noCheck="false"><span class="fz_12 color_9">挂失</span><img src="../../img/icon11_1.png" /></a>
							<a name="delete"><span class="fz_12 color_9">删除</span><img src="../../img/icon13_1.png" /></a>
            		 * */
           			var li_report = $('<li class="own_btn_bg"></li>');
           			var div = $('<div class="pub_btnbox2">'+
           					'<a name="return"><span class="fz_12 color_9">还款</span><img src="../../img/icon15_1.png" /></a>'+
           					'<a name="bill"><span class="fz_12 color_9">未出账单</span><img src="../../img/icon14_1.png" /></a>'+
            				'<a name="emergencyLoss" num="'+i+'" cardNo="'+cardNo+'" status="'+status+'"><span class="fz_12 color_9">挂失</span><img src="../../img/icon11_1.png" /></a>'+
            				'<a name="delete" cardNo="'+cardNo+'"><span class="fz_12 color_9">删除</span><img src="../../img/icon13_1.png" /></a>'+
            			'</div>');
           			li_report.append(div);
            		ul.append(li_account).append(li_ava).append(li_report);
            		rmbAccount.append(ul);
				}
				$('div a[name="emergencyLoss"]').unbind();
				$('div a[name="return"]').unbind();
				$('div a[name="bill"]').unbind();
				$('div a[name="delete"]').unbind();
				
				$('div a[name="emergencyLoss"]').on('tap',function(){
					var num = $(this).attr('num');
					var cardNo = $(this).attr('cardNo');
					var status = $(this).attr('status');
					mui.confirm("确定挂失？","提示",["确定", "取消"], function(e) {
						if (e.index == 0){
								sendLoss(cardNo);
						}
					});
				});
				
				$('div a[name="return"]').on('tap',function(){
					mbank.openWindowByLoad("../creditCard/thisInitiativeRefundMenuInfo.html","thisInitiativeRefundMenuInfo","slide-in-right");
				});
				$('div a[name="bill"]').on('tap',function(){
					mbank.openWindowByLoad("../creditCard/limitUnknowHistory.html","limitUnknowHistory","slide-in-right");
				});
				//删除
				$('div a[name="delete"]').on('tap',function(){
					var cardNo = $(this).attr('cardNo');
					mui.confirm("确定删除？","提示",["确定", "取消"], function(e) {
						if (e.index == 0){
							var accountInfo = getCardInfo(cardNo);
							var url = mbank.getApiURL() + "deleteCreditCard.do";
							var params = {
								accountNo:accountInfo.accountNo,
								customerName:userInfo.get("session_customerNameCN"),
								accountOpenNodeName:accountInfo.accountOpenNodeName,
								accountStat:accountInfo.accountStat
							};
//							console.log(params.accountNo+"---"+params.customerName+"---"+params.accountOpenNodeName+"--"+params.accountStat);
							mbank.apiSend("post",url,params,successCallback,reportFail,true);
						}
					});
					
				});
				
			} else {
				$('#showMsgDiv').show();
			}
				
		} 
		
		function successCallback(){
			mbank.initAccountInfo();
			mui.alert("删除成功","温馨提示","确定",function(){
				reload();
			});
		}
		
		
		function getCardInfo(cardNo){
			for(var i=0;i<iAccountInfoList.length;i++){
				if(iAccountInfoList[i].accountNo==cardNo){
					return iAccountInfoList[i];
				}
			}
			
		}
		
		function getAvaiable(accountNo){
			var params = {
				"cardNo":accountNo
			};
			var url = mbank.getApiURL() + '007104_limitQuery.do';
			mbank.apiSend('post', url, params, function(data) {
				var balance = format.formatMoney(data.AvblLimit);
				$('#type'+accountNo).empty().append(balance);
			},function(){},true);
		}
		
		function sendLoss(cardNo){
			var params = {
				CardNo:cardNo,
				IdType:idType
			};
			var url = mbank.getApiURL() + 'cardReport.do'; 
			
			mbank.apiSend('post',url,params,reportSuccess,reportFail,true);
		}
		
		function reportSuccess(data){
			mui.alert("挂失成功","温馨提示","确定",function(){
				reload();
			});
		}
		
		function reportFail(e){
			mui.alert(e.em,"温馨提示");
		}
		
	});
});