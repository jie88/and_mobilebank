define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		mui("#chargeDiv").on("tap","li",function(){
			var id =jQuery(this).attr("id");
		    var path=jQuery(this).attr("path");
		    var noCheck=jQuery(this).attr("noCheck");
		    mbank.openWindowByLoad(path,id, "slide-in-right",{noCheck:noCheck});
		});
		mui("#setDiv").on("tap","li",function(){
			var id =jQuery(this).attr("id");
		    var path=jQuery(this).attr("path");
		    var noCheck=jQuery(this).attr("noCheck");
		    mbank.openWindowByLoad(path,id, "slide-in-right",{noCheck:noCheck});
		});
	});
});