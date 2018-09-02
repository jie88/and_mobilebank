define(function(require, exports, module) {
	var mbank = require('../../core/bank');
    var top='64px';
    if( mui.os.android ){
    	top='44px';
    }
    
    mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},subpages:[{
			url:'../cashSweep/cashSweepHisQuerySub.html',
			id:'cashSweepHisQuerySub',
			styles: {
			    top: top,			    
			    bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
	});
});