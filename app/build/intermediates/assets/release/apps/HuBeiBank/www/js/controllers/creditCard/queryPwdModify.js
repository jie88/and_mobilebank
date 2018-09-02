define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	var passwordUtil = require('../../core/passwordUtil');
	var commonSecurityUtil = require('../../core/commonSecurityUtil');
	mui.init();
	var params;
	var urlVar;
	var currentAcct;
	var sendParam;
	var pwdReg =  new RegExp("^[0-9]{6}$", "i");
	
	var IdNo = localStorage.getItem("session_certNo");
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var idType = localStorage.getItem("session_certType");
		var idNo = localStorage.getItem("session_certNo");
		
		idType = $.param.getDisplay('CERT_TYPE_CREDIT',idType);
		loadAccountList();
		function loadAccountList(){
			mbank.getAllAccountInfo(allAccCallBack,"6");
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
				var accountPicker = new mui.SmartPicker({title:"请选择信用卡卡号",fireEvent:"accountChange"});
				accountPicker.setData(accountPickerList);
					
				currentAcct = iAccountList[0].accountNo;
				document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
				sendParam = {
					"accountNo" : currentAcct
				};
				commonSecurityUtil.initSecurityData('028002',sendParam);	
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
		}
		window.addEventListener("accountChange",function(event){
			currentAcct = event.detail.value;
			document.getElementById("accountNo").innerText = format.dealAccountHideFour(currentAcct);
			sendParam = {
				"accountNo" : currentAcct
			};
			commonSecurityUtil.initSecurityData('028002',sendParam);
        });
		
		if(jQuery.param.SOFTPWD_SWITCH) {
			var oldPwd=document.getElementById('oldPwd');
			oldPwd.readOnly="readOnly";
			oldPwd.addEventListener('click', function() {
				passwordUtil.openNumKeyboard('oldPwd',null,null);
			},false);
			
			var newPwd=document.getElementById('newPwd');
			newPwd.readOnly="readOnly";
			newPwd.addEventListener('click', function() {
				passwordUtil.openNumKeyboard('newPwd',null,null);
			},false);
			
			var confirmNewPwd=document.getElementById('confirmNewPwd');
			confirmNewPwd.readOnly="readOnly";
			confirmNewPwd.addEventListener('click', function() {
				passwordUtil.openNumKeyboard('confirmNewPwd',null,null);
			},false);
		}
		
		document.getElementById("submitButton").addEventListener("tap",function(){
			if(currentAcct == null || currentAcct == undefined || currentAcct == "" || currentAcct.length ==0){
				mui.alert("请选择账号","温馨提示");
				return;
			}
			var oldPwdVal = document.getElementById("_oldPwd").value;
			var newPwdVal = document.getElementById("_newPwd").value;
			var confirmNewPwdVal = document.getElementById("_confirmNewPwd").value;
			if($.param.SOFTPWD_SWITCH){
				if(!passwordUtil.checkMatch('oldPwd')){
					mui.alert('请输入6位数字的原密码',"温馨提示");
					return false;
				}
				if(!passwordUtil.checkMatch('newPwd')){
					mui.alert('请输入6位数字的新密码',"温馨提示");
					return false;
				}
				if(!passwordUtil.checkMatch('confirmNewPwd')){
					mui.alert('请输入6位数字的确认新密码',"温馨提示");
					return false;
				}
				if(!passwordUtil.checkPwdIdentify('newPwd','confirmNewPwd')){
					mui.alert("新密码两次输入不一致，请重新输入","温馨提示");
					return;
				}
				if(passwordUtil.checkPwdIdentify('oldPwd','newPwd')){
					mui.alert("新密码不能和旧密码一致，请重新设置","温馨提示");
					return;
				}
			}
			var randomSum = passwordUtil.getRandomNumber();
			params = {
				"CardNo" : currentAcct,
				"IdType": idType,
				"PinType" : "Q",
				"PinData" : oldPwdVal,
				"newPassword":newPwdVal,
				"randomSum" : randomSum
			}
			urlVar = mbank.getApiURL()+'updateCreditPwd.do';
			//mbank.apiSend("post",urlVar,params,updateAccPwdSucFunc,updateAccPwdFailFunc,true);
			commonSecurityUtil.apiSend("post",urlVar,params,checkCardSucc,checkCardErr,true);
			function checkCardSucc(data){
				if(data.ec =="000"){
					mui.alert("查询密码修改成功","温馨提示","确定",function(){
						plus.webview.currentWebview().close();
					});
				}else{
					mui.alert(data.em,"温馨提示");
				}
			}
			function checkCardErr(e){
				mui.alert(e.em,"温馨提示");
			}
			
		},false);
		
		plus.key.addEventListener('backbutton', function(){
			passwordUtil.hideKeyboard("oldPwd");
			passwordUtil.hideKeyboard("newPwd");
			passwordUtil.hideKeyboard("confirmNewPwd");
			mui.back();
		});
		
		mbank.resizePage(".but_bottom20px");
	});
});