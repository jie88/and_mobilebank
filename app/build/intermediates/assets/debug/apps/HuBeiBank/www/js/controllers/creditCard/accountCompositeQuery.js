/*
 * 账户综合信息查询
 */
define(function(require, exports, module) {
	
	var doc = document;
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	var param = require('../../core/param');
	var util = require('../../core/utils');
	

	//信用卡列表
	var iAccountInfoList = [];
	var accountPickerList=[];
	var cardList = [];
	var length;
	var currCredit;
	
	//显示数据
	var cardNo;
	var ckCardNo = "";
	//上送数据
	var IdType = localStorage.getItem("session_certType");
	var IdNo = localStorage.getItem("session_certNo");
	var ProcCode = "acqdqr";
	
	mui.init();
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		var self = plus.webview.currentWebview();
		var ApplBranch;
		cardList = self.cardList;
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				//console.log(iAccountInfoList)
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
					$("#cardNo").val(currentAcct);
					cardNo = currentAcct;
					compositionQuery(cardNo);
					
				}
				//queryCridetSign(currentAcct);
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
				accountPicker = new mui.SmartPicker({title:"请选择信用卡",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		$("#changecardNo").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});

        window.addEventListener("payAccount",function(event){
                var param=event.detail;			
				currentAcct=iAccountInfoList[param.value];
				$("#cardNoShow").html(format.dealAccountHideFour(currentAcct.accountNo));     
        		$("#cardNo").val(currentAcct.accountNo);
        		cardNo = $("#cardNo").val();
        		compositionQuery(cardNo);
        		
        });
        
        function compositionQuery(card){
        	var url = mbank.getApiURL() + 'compositeQuery.do';
        	mbank.apiSend('post',url, {
        		ProcCode:ProcCode,
        		CardNo:card,
        		IdType:IdType,
        		IdNo:IdNo
        	}, querySuccess, queryError, true);
        	function querySuccess(data){
        		ApplBranch = data.ApplBranch;
        		//console.log("ApplBranch"+ApplBranch);
        		//doc.getElementById("ApplBranch").innerHTML = data.ApplBranch;
        		doc.getElementById("CreditLimit").innerHTML = format.formatMoney(data.CreditLimit/100) + "元";
        		doc.getElementById("AvblLimit").innerHTML = format.formatMoney(data.AvblLimit/100) + "元";
        		doc.getElementById("CashLimit").innerHTML = format.formatMoney(data.CashLimit/100) + "元";
        		doc.getElementById("BillingCycle").innerHTML = "每月" + data.BillingCycle + "号";
        		doc.getElementById("MinPayAmt").innerHTML =  format.formatMoney(data.MinPayAmt/100) + "元";
        		//doc.getElementById("BillingBal").innerHTML =  parseInt(data.BillingBal) + "元";
        		doc.getElementById("RepayAccount").innerHTML = format.dealAccountHideFour(data.RepayAccount);
        		doc.getElementById("DueDate").innerHTML = (data.DueDate).substring(0,4)+"年"+(data.DueDate).substring(4,6)+"月"+(data.DueDate).substring(6,8)+"日";
        		doc.getElementById("BillingCycle2").innerHTML = "本月" + data.BillingCycle + "号";
        		queryBank(ApplBranch);
        	}
        	function queryError(e){
        		nativeUI.toast(e.em);
				ckCardNo  = "";
        	}
        	
        }
		
		
		function queryBank(bankId){
			//console.log("111111111111");
			var param={
				ApplBranch:bankId
			};
			var url = mbank.getApiURL() + 'queryBank.do';
			mbank.apiSend('post',url, param, queryFun, queryErr, false);
        	
        	function queryFun(data){
        		console.log(data.bankName);
        		doc.getElementById("ApplBranch").innerHTML = data.bankName;
        	}
			function queryErr(){
				console.log("222222222");
			}
		}
		
		
		
		
		
	});
});