/**
 * 阻止手机截屏插件

 */
document.addEventListener("plusready", function() {
	// 声明的JS“扩展插件别名”
	var _BARCODE = 'pluginSrnCapture',
		B = window.plus.bridge;
	var pluginSrnCapture = {
		// 声明异步返回方法
		forBidScreenCap: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null :
				function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null :
				function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "forBidScreenCap", [callbackID]);
		}
	};
	window.plus.pluginSrnCapture = pluginSrnCapture;
}, true);