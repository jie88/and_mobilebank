define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var userInfo = require('../../core/userInfo');
	
	var top='64px';
    if( mui.os.android ){
    	top='44px';
    }

	mui.init({
		swipeBack: false,
		keyEventBind: {
			backbutton: false,
			menubutton: false
		},
		subpages: [{
			url: '../savings/largeDepositProListSub.html',
			id: 'largeDepositProListSub',
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