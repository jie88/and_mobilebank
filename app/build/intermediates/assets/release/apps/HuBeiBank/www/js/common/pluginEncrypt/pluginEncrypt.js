/**
 * Linkface 授权状态插件；

 */
document.addEventListener("plusready", function() {
                          // 声明的JS“扩展插件别名”
                          var _BARCODE = 'pluginEncryprt', B = window.plus.bridge;
                          var pluginEncryprt = {
                          // 声明异步返回方法
                          getEncryprtString : function(Argus1,Argus2,Argus3, successCallback, errorCallback) {
                          var success = typeof successCallback !== 'function' ? null
                          : function(args) {
                          successCallback(args);
                          }, fail = typeof errorCallback !== 'function' ? null
                          : function(code) {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          // 通知Native层plugintest扩展插件运行”PluginTestFunction”方法
                          return B.exec(_BARCODE, "getEncryprtString", [ callbackID, Argus1,Argus2,Argus3]);
                          }
                          };
                          window.plus.pluginEncryprt = pluginEncryprt;
                          }, true);


