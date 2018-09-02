define(function(require, exports, module) {
	
	var top = 65;
	if(mui.os.android ){
		top = top -20 + 'px';				
	}else{
		top = top + 'px';			
	}
	mui.init({
		swipeBack:false,
		keyEventBind: {
			backbutton: true,
			menubutton: false
		}
		,subpages:[{
				url:'adViewDetail_sub.html',
				id:'adViewDetail_sub',
				styles: {
				top: top,
				bottom: '0px'
			}
		}]
	});
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		var ADValue = self.ADValue;
		var returnurl = self.returnurl;
		var title = self.ADtitle;
		if (returnurl == null || returnurl == "") {
			
		}else{
				$("#adHead").html(title);
		}
		
		
		if(self.opener() && self.opener().id == 'start'){
			var back = mui.back;
			mui.back = function(){
				self.hide();
				plus.webview.getLaunchWebview().evalJS("appVersionUpdate &&appVersionUpdate()");
				self.close();
			}
			
			plus.key.addEventListener('backbutton',function(){
				self.hide();
				plus.webview.getLaunchWebview().evalJS("appVersionUpdate &&appVersionUpdate()");
				self.close();
			})
		}
	
	});
});