define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
    var iPayQueryList = [];//增加归集账户列表
    var iPayQueryListBak = [];//归集账户列表
    var accountPickerList = [];
    var accountPicker;
    var payAccountAry = "";//所选归集账户信息
    var payAccount = "";//归集账户
    var collectAmt = "";//固定归集金额
    
    var params;
    var url;
	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		var recAccount = self.recAccount;//中心账户
	    var collectStyle = self.collectStyle;//归集方式
	    var collectCircle = self.collectCircle;//归集周期 
	    var circleDAY = self.circleDAY;//周期内执行日
	    var protocolDate = self.protocolDate;//协议生效日期
	    var protocolDuring = self.protocolDuring;//协议期限
		
		showDetail();
		
		
		function showDetail(){
			document.getElementById('recAccount').innerText = format.dealAccountHideFour(recAccount);
			document.getElementById('collectStyle').innerText = jQuery.param.getDisplay('SHOW_COLLSTYLE', collectStyle);
			if(collectStyle == "0"){
				document.getElementById('showCollStyle').innerText = "保底归集金额";
			}else if(collectStyle =="1"){
				document.getElementById('showCollStyle').innerText = "固定归集金额";
			}else{
				document.getElementById('showCollStyle').innerText = "保底归集/定额归集金额";
			}
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

		//根据中心账户到后台查询已查询签约和支付签约的归集账户
		getList(recAccount);
	
		//通过Ajax获取归集账户列表
		function getList(centerAccount){
			params ={
				"centerAccountNo":centerAccount
			};
			url = mbank.getApiURL() + 'queryFundCollAccount.do';
			mbank.apiSend("post",url,params,successCallback,errorCallback,false);
			function successCallback(data){
				iPayQueryListBak  = data.iPayQueryListBak;
				getPickerList();
			}
			function errorCallback(data){
				mui.alert(data.em,"温馨提示","确定",function(event){
					plus.webview.currentWebview().close();
				});
			}
		}
		//获取账号列表
		function getPickerList(){
			if( iPayQueryListBak.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iPayQueryListBak.length;i++ ){
					var list = iPayQueryListBak[i];
					var hidden = list.AthDealNo+"&"+list.QryDealNo+"&"+list.payAccount+"&"+list.payAccountName+"&"+list.payAccountBkNo+"&"+list.payAccountOpenBankName+"&"+
							list.singleLimit+"&"+list.dayCntLimit+"&"+list.monthAmtLimit+"&"+list.monthCntLimit+"&"+list.beginDate+"&"+list.endDate+"&"+
							list.recAccount+"&"+list.recAccountName+"&"+list.recAccountOpenBankName+"&"+list.recAccountBkNo+"&"+list.dayLimit;
					var pickItem={
						value: list.payAccount+"@"+hidden,
						text: list.payAccount
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择归集账户",fireEvent:"pickAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		document.getElementById("changeAccount").addEventListener("tap",function(){
			if(iPayQueryListBak.length>0){
				accountPicker.show();//显示账号选择下拉框	
			}else{
				mui.alert("该中心账户下无归集账户");
			}
		},false);
		//选择账号触发事件
        window.addEventListener("pickAccount",function(event){
			payAccountAry=event.detail.value;
			payAccount=event.detail.text;
			document.getElementById('payAccount').innerText = payAccount;
        });
        
        //格式化金额
        $("#collectAmt").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#collectAmt").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
		
		document.getElementById("addButton").addEventListener("tap",function(){
			if(!payAccount){
				mui.alert("请选择归集账户");
				return;
			}
			collectAmt=format.ignoreChar(document.getElementById("collectAmt").value,',');
			if(!collectAmt){
				mui.alert("归集金额不能为空");
				return;
			}
        	if( !isMoney(collectAmt) || parseFloat(collectAmt)<=0 ){
        		mui.alert("请输入合法归集金额");
        		return;
        	}
        	plus.nativeUI.showWaiting();
        	var status = "";
			params ={
				"payAccount":payAccount,
				"centerAccountNo":recAccount
			};
			url = mbank.getApiURL() + 'checkFundAccSts.do';
			mbank.apiSend("post",url,params,checkStatusSuc,checkStatusFail,false);
			function checkStatusSuc(data){
				if(data.ec =='000'){
					status = data.status;
					if(status > 0){
						plus.nativeUI.closeWaiting();
						mui.alert("此归集账户已存在，请重新选择");
						return;
					}else{
						var hiddenVal = payAccountAry.split("@")[1];
						var listAry = hiddenVal.split("&");
						var orderFlowNo="";
						params = {};
						url = mbank.getApiURL() + 'GetOrderFlowNo.do';
						mbank.apiSend("post",url,params,getFlowSuc,getFlowFail,false);
						function getFlowSuc(data){
							orderFlowNo = data.orderFlowNo;
							getHtml(listAry,collectAmt,collectStyle,protocolDate,protocolDuring,collectCircle,orderFlowNo,circleDAY);
						}
						function getFlowFail(e){
							plus.nativeUI.closeWaiting();
							mui.alert(e.em);
							return false;
						}
					}
				}else{
					plus.nativeUI.closeWaiting();
					mui.alert(data.em);
					return false;
				}
			}
			function checkStatusFail(e){
				plus.nativeUI.closeWaiting();
				mui.alert(e.em);
				return false;
			}
		},false);
		
		//动态生成归集账户列表
		function  getHtml(listAry,collectAmt,collectStyle,protocolDate,protocolDuring,collectCircle,orderFlowNo,circleDAY){
		 	var balance  = "";//查询协议号查询归集账户余额情况
			params ={
				"QryDealNo":listAry[1],
				"FeeType":"1",
				"FeeAmt":"",
				"turnPageShowNum":"99",
				"turnPageBeginPos":"1"
			};
			url = mbank.getApiURL() + 'queryFundAccBalance.do';
			var list = listAry;
			mbank.apiSend("post",url,params,queryBalSuc,queryBalFail,false);
			function queryBalSuc(data){
				balance = data.totalBalance;
				listAry.push(collectAmt);
				listAry.push(collectStyle);
				listAry.push(protocolDate);
				listAry.push(protocolDuring);
				listAry.push(orderFlowNo);
				listAry.push(balance);
				listAry.push(collectCircle);
				listAry.push(circleDAY);
				iPayQueryList.push(listAry);
				var showId = "li_" + payAccount;
				var html = "";
				html+='<li id='+ showId + '>'
			    	+'   <p class="fz_16"><input type="checkbox" checked="checked"></input>归集账户:'+payAccount+'</p>'
			    	+'   <p class="m_left15px color_9">户名:'+listAry[3]+'<span class="m_left10px color_9">归集账户余额:'+balance+'元</span></p>'
			    	+'   <p class="m_left15px color_9">开户行:'+listAry[5]+'<span class="m_left10px color_9">归集金额:'+collectAmt+'元</span></p>'
			    	+'   <a class="delete_icon" id='+ payAccount+ ' payAccountAry='+ payAccountAry+ '><img src="../../img/delete_ico.png" /></a>'
				$("#payAccountList").append(html);
	    
			    //清空数据
				for( var i=0;i<accountPickerList.length;i++ ){
					var list = accountPickerList[i];
					if(list.text == payAccount){
						accountPickerList.splice(i, 1);//实时删除已添加的归集账户
						accountPicker = new mui.SmartPicker({title:"请选择归集账户",fireEvent:"pickAccount"});
				    	accountPicker.setData(accountPickerList);
						break;
					}
				}
				payAccountAry = "";
				payAccount = "";
				document.getElementById('payAccount').innerText = "请选择归集账户";
				document.getElementById('collectAmt').value = "";
				plus.nativeUI.closeWaiting();
			}
			function queryBalFail(e){
				plus.nativeUI.closeWaiting();
				mui.alert(e.em);
				return;
			}
		}
		
		//删除操作
		mui('#payAccountList').on('tap','.delete_icon',function(event) {
			var delId = this.getAttribute('id');
			var payAccountAryVal = this.getAttribute('payAccountAry');
			mui.confirm("确定要删除此归集账户吗？","温馨提示",["确定","取消"],function(event){
				if(event.index == 0){
					deletefFundAccount(delId, payAccountAryVal);
				}else{
					return;
				}
			});
		});
		//删除列表操作
		function deletefFundAccount(id, payAccountAryVal){
			var pickItem={
				value: payAccountAryVal,
				text: id
			};
			accountPickerList.push(pickItem);//恢复已删除删除的归集账户
			//归集账户列表增加记录
			accountPicker = new mui.SmartPicker({title:"请选择归集账户",fireEvent:"pickAccount"});
	    	accountPicker.setData(accountPickerList);
	    	
			$("#li_"+id).remove();//删除数据
			iPayQueryList.remove(id);
		}
		
		//循环删除数组指定数据
		Array.prototype.remove = function(id){
			if(isNaN(id)||id==undefined||id==null||id==""){
				return false;
			}
			for ( var i = 0,n=0; i < this.length; i++) {
				if(this[i][2]!=id){
					this[n++] = this[i];
				}
			}
			this.length-=1;
		}
        
        
	    
	    //选中的集合数据
		function selFundList(){
			var selectedList = new Array();
			$.each(iPayQueryList,function(i){
				var boolean = jQuery(':checkbox').eq(i).is(':checked');//判断是否选中，返回true或false
				if(boolean){
					selectedList.push(iPayQueryList[i]);
				}
			});
			return selectedList;
		}
		document.getElementById("nextButton").addEventListener("tap",function(){
			var checkbox = jQuery(':checkbox:checked');//
			if(checkbox.length<=0){
				mui.alert("请至少选择一个归集账户");
			}else{
				var FundList = selFundList();//选中集合数据
				var params = {
					"recAccount": recAccount,//中心账号
					"collectStyle": collectStyle,//归集方式
					"collectCircle": collectCircle,//归集周期 
					"circleDAY": circleDAY,//周期内执行日
					"protocolDate": protocolDate,//协议生效日期
					"protocolDuring": protocolDuring,//协议期限
					"list":FundList,//选中集合数据
					"noCheck": true
				}
				mbank.openWindowByLoad('../cashSweep/cashSweepSetStep4.html','cashSweepSetStep4','slide-in-right',params);
			}
		},false);
	    document.getElementById("prevButton").addEventListener("tap",function(){
			mui.back();
		},false);
	    
	    mbank.resizePage(".btn_bg_f2");//按钮置底
	});
});