define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var muiBack = mui.back;
		document.getElementById("lastButton").addEventListener("tap",function(){
			mbank.back('cashSweepHome',muiBack);
		},false);
		mui.back=function(){
			mbank.back('cashSweepHome',muiBack);
		}
	});
});