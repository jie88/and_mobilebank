define(function(require, exports, module) {
	// 引入依赖
	var app = require('../../core/app');
	var userInfo = require('../../core/userInfo');
	var mbank = require('../../core/bank');
	var nativeUI = require('../../core/nativeUI');
	var format = require('../../core/format');
	var sessionid = userInfo.get('sessionId');
	
	var iAccountInfoList = [];
	var accountNoTemp;
	mui.init();//预加载
	mui.plusReady(function(){
				plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		
		
		//交易密码修改
		var tranPwdModify = document.getElementById("tranPwdModify");
		tranPwdModify.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
	
		//查询密码修改
		var queryPwdModify = document.getElementById("queryPwdModify");
		queryPwdModify.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck});
		});
	});
});