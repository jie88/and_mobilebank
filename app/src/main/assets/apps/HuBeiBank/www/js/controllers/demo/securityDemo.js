define(function(require, exports, module){
	
	var doc = document;
	var m= mui;
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var usbKeyUtil = require('../../core/usbKeyUtil');

	m.init();
	m.plusReady(function(){
		
		var self = plus.webview.currentWebview();
		//commonSecurityUtil.initSecurityData('002007',self);
		
		document.getElementById('reverseUk').addEventListener('click',function(){
			//reverseFrequencyKey
		})
		
		
		document.getElementById('getUKSNno').addEventListener('click',function(){
			usbKeyUtil.getUsbkeySnNum(function(data){
				alert(data)
			},null)
		},true);
		
		
		document.getElementById('confirmButton').addEventListener('click',function(){
			var key = "1143242krjwfnkjfeng=";
			var signData = {payAccount:'111111111',recAccount:'22222222222'};
			var format = '付款账号#payAccount|收款账号#recAccount';
			var message = usbKeyUtil.getSignSourceValue(null, format, signData,key);
			var ukeyId = "_usbkeyInput";
			var pin = '111111a';
			usbKeyUtil.signDataByUsbKey(ukeyId,message,pin,function(data){
				alert(data)
			},null)
		},true);
		
		
		//commonSecurityUtil.apiSend()
		
	})
	
})