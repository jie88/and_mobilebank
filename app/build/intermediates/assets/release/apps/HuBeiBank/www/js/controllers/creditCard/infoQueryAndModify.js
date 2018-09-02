/*
 * 资料查询与修改
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
	var ProcCode = "cstinf";
	
	//修改数据
	var HomeTel = doc.getElementById("HomeTel");
	var CompanyName = doc.getElementById("CompanyName");
	var CompanyTel = doc.getElementById("CompanyTel");
	var CompanyAddress = doc.getElementById("CompanyAddress");
	var StatementAddress = doc.getElementById("StatementAddress");
//	var StatementPostNo = doc.getElementById("StatementPostNo");
	var EmailAddress = doc.getElementById("EmailAddress");
	var StatementMedia = doc.getElementById("StatementMedia");
	
	var MobilPhone;
	var email;//email
	var companyName;//单位名称
	var HomeStateName;
	var homeTel;//住宅电话
	var HomeCityName;
	var HomeDistrict;
	var HomeDetailAddr;//邮寄地址
	var CompStateName;
	var CompCityName;
	var CompDistrict;
	var CompDetailAddr;//单位地址
	var companyTel;//单位电话
	var StatementAddrType;//邮寄方式
	var CardDeliveryAddrType;
	var ContactName;
	var ContactMobPhone;
	var ContactRelation;
	var SecndContName;
	var SecndContMobPhone;
	var SecndContRelation;
//	var companyTel;
	var addrType;
	
	
	var creditAction_success = doc.getElementById("creditAction_success");
	
	mui.init();
	
	mui.plusReady(function() {
		mbank.resizePage("#abc");
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕方向
		var state = app.getState();
		var postAdd = [{text:"住宅",value:"HOME"},{text:"单位",value:"COMPANY"}];
		var self = plus.webview.currentWebview();
		cardList = self.cardList;
		queryCreditCardAccount();//查询用户信用卡下挂账户列表
		function queryCreditCardAccount(){
			mbank.getAllAccountInfo(allCardBack,"6");
			function allCardBack(data){
				iAccountInfoList = data;
				//console.log(iAccountInfoList)
				getPickerList(iAccountInfoList);
				addressInit();
				var length = iAccountInfoList.length;
				if (length > 0) {
					currentAcct = iAccountInfoList[0].accountNo;
					$("#cardNoShow").html(format.dealAccountHideFour(currentAcct));
					$("#cardNo").val(currentAcct);
					cardNo = currentAcct;
					cstInfoQuery(cardNo);
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
		
		function addressInit(){
			var addressPicker = new mui.SmartPicker({title:"请选邮寄地址",fireEvent:"postAdd"});
			addressPicker.setData(postAdd);
			document.getElementById("postAdd").addEventListener("tap",function(){
				addressPicker.show();
			},false);
		}

        window.addEventListener("payAccount",function(event){
                var param=event.detail;			
				currentAcct=iAccountInfoList[param.value];
				$("#cardNoShow").html(format.dealAccountHideFour(currentAcct.accountNo));     
        		$("#cardNo").val(currentAcct.accountNo);
        		cardNo = $("#cardNo").val();
        		//查询卡信息接口调用
        		cstInfoQuery(cardNo);
        });
        
        window.addEventListener("postAdd",function(event){
                var param=event.detail;
                $("#StatementAddress").html(param.text);
				StatementAddrType = param.value;
        });
		
		function cstInfoQuery(card){
			var url = mbank.getApiURL() + 'cstInfoQuery.do';
			mbank.apiSend('post',url, {
        		ProcCode:ProcCode,
        		CardNo:card
        	}, querySuccess, queryError, true);
        	function querySuccess(data){
        		MobilPhone = data.MobileNo;
          		$('#MobilPhone').html(MobilPhone);
        		HomeTel.value = data.HomeTel;//住宅电话--
        		homeTel = data.HomeTel;
        		if(data.HomeTel==''||data.HomeTel==null){
        			homeTel = "";
        			$('#homePhone').hide();
        		}
        		CompanyName.value = data.CompanyName;//单位名称--
        		CompanyTel.value = data.CompanyTel;//单位电话--
        		companyTel = data.CompanyTel;
        		CompanyAddress.value = data.CompDetailAddr;//单位地址
//      		StatementAddress.value = data.HomeDetailAddr;//邮寄地址
//      		StatementPostNo.value = data.StatementPostNo;
        		EmailAddress.value = data.EmailAddress;//email--
        		email = data.EmailAddress;
        		if(data.StatementMedia=="LT"){
        			StatementMedia.innerHTML = "信件寄送";//邮寄方式
        		}else if(data.StatementMedia=="EM"){
        			StatementMedia.innerHTML = "电子邮件寄送";
        		}else {
        			StatementMedia.value = "混合寄送";
        		}
        		companyName = data.CompanyName;
        		HomeStateName = data.HomeStateName;
        		HomeCityName = data.HomeCityName;
        		HomeDistrict = data.HomeDistrict;
        		HomeDetailAddr = data.HomeDetailAddr;
        		CompStateName = data.CompStateName;
        		CompCityName = data.CompCityName;
        		CompDistrict = data.CompDistrict;
        		CompDetailAddr = data.CompDetailAddr;
        		StatementAddrType = data.StatementAddrType;
        		addrType = data.StatementAddrType;
        		if(StatementAddrType=='HOME'){
        			$("#StatementAddress").html("住宅");
        		} else if(StatementAddrType=='COMPANY'){
        			$("#StatementAddress").html("单位");
        		}
        		
        		
        		
        		CardDeliveryAddrType = data.CardDeliveryAddrType;
        		ContactName = data.ContactName;
        		ContactMobPhone = data.ContactMobPhone;
        		ContactRelation = data.ContactRelation;
        		SecndContName = data.SecndContName;
        		SecndContMobPhone = data.SecndContMobPhone;
        		SecndContRelation = data.SecndContRelation;
        		
        	}
        	function queryError(e){
        		nativeUI.toast(e.em);
				ckCardNo  = "";
        	}
		}
		
		//按钮点击发送请求
		creditAction_success.addEventListener('tap',function(){
			
			if(EmailAddress.value==email&&CompanyName.value==companyName&&HomeTel.value==homeTel&&CompanyTel.value==companyTel&&CompanyAddress.value==CompDetailAddr&&StatementAddrType==addrType){
				mui.alert("未对资料作出修改");
				return false;
			}
			
			var info = {
				ProcCode : "infmod",
				CardNo : cardNo,
				MobileNo : MobilPhone,
				EmailAddress : EmailAddress.value,
				CompanyName : CompanyName.value,
				HomeTel : HomeTel.value,
				HomeStateName : HomeStateName,
				HomeCityName : HomeCityName,
				HomeDistrict : HomeDistrict,
				HomeDetailAddr : HomeDetailAddr,
				CompStateName : CompStateName,
				CompCityName : CompCityName,
				CompDistrict : CompDistrict,
				CompDetailAddr : CompanyAddress.value,
				CompanyTel : CompanyTel.value,
				StatementAddrType : StatementAddrType,
				CardDeliveryAddrType : CardDeliveryAddrType,
				ContactName : ContactName,
				ContactMobPhone : ContactMobPhone,
				ContactRelation : ContactRelation,
				SecndContName : SecndContName,
				SecndContMobPhone : SecndContMobPhone,
				SecndContRelation : SecndContRelation
			};
			var url = mbank.getApiURL() + 'cstInfoModify.do';
			if(infoCheck(HomeTel.value,CompanyTel.value,EmailAddress.value)){
				mbank.apiSend('post', url, info, modifySuccess, modifyError,  true, false);	
				function modifySuccess(data){
					var path = doc.getElementById("creditAction_success").getAttribute("path");
					var id = doc.getElementById("creditAction_success").getAttribute("id");
					var noCheck = doc.getElementById("creditAction_success").getAttribute("noCheck");
					var successType = "3";
					//mui.alert(id);
					mbank.openWindowByLoad(path, id, "slide-in-right",{successType:successType, noCheck:noCheck});
				}
				function modifyError(e){
					
				}
			}
			
		});
		
		
		//上送信息校验及
		function infoCheck(homePhone,companyPhone,email){
			var index1 = 0;
			var index2 = 0;
			var index3 = 0;
			var re = /^(\d{7,8})?$/;
			var rg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			console.log(homePhone+"|"+companyPhone+"|"+email)
			if(null!=homePhone || ""!=homePhone){
				if(re.test(homePhone)){
					index1 ++;
				}else{
					nativeUI.toast("输入正确的住宅电话");
					index1 --;
				}
			}
			
			if(null!=companyPhone || ""!=companyPhone){
				if(re.test(companyPhone)){
					index2 ++;
				}else{
					nativeUI.toast("输入正确的公司电电话");
					index2 --;
				}
			}
			
			if(email){
				if(rg.test(email)){
					index3 ++;
				}else{
					nativeUI.toast("输入正确的邮箱地址");
					index3 --;
				}
			}
			if(index1>=0 && index2>=0 && index3>=0){
				return true;
			}
			return false;
			// || null!=companyPhone || ""!=companyPhone || null!=email || ""!=email
		}
		
		
	});
});