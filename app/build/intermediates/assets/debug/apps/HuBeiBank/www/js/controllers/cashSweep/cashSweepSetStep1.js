define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		document.getElementById("prevButton").addEventListener("tap",function(){
			mui.back();
		},false);
		document.getElementById("nextButton").addEventListener("tap",function(){
			mbank.openWindowByLoad('../cashSweep/cashSweepSetStep2.html','cashSweepSetStep2','slide-in-right',{noCheck : false});
		},false);
	});
});