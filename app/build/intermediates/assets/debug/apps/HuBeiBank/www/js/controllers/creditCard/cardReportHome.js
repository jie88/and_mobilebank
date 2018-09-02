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
		
		
		//主卡挂失
		var mainCardReport = document.getElementById("mainCardReport");
		mainCardReport.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck,pathFlag:'0'});
		});
		
		//附属卡挂失
		var additionalCardReport = document.getElementById("additionalCardReport");
		additionalCardReport.addEventListener('tap',function(){
			var path = this.getAttribute("path");
			var id = this.getAttribute("id");
			var noCheck = this.getAttribute("noCheck");
			mbank.openWindowByLoad(path, id, "slide-in-right", {noCheck:noCheck,pathFlag:'1'});
		});
	});
});