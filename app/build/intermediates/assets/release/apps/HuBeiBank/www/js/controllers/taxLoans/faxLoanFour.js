define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		self = plus.webview.currentWebview();
		var applyMoney = self.applyMoney;
		var loanDate = self.loanDate;
		var payType = self.payType;
		var useType = self.useType;
		var accountNo = self.accountNo;
		var organization = self.organization;
		var applyArea = self.applyArea;
		var commendNo = self.commendNo;
		var creditNo = self.creditNo;
		var registerNo = self.registerNo;
		var checkNo = self.checkNo;
		var organizationNo = self.organizationNo;

		//console.log(JSON.stringify(self));
		$("#idCardScanRight").on("tap", function() {
			plus.nativeUI.actionSheet({ 
					cancel: "取消",
					buttons: [{
						title: "拍照"
					}, {
						title: "从相册中选择"
					}]
				},
				function(e) {
					switch(e.index) {
						case 1:getImgFromCamera('idCardScanRight');break;
						case 2:getImgFromGallery('idCardScanRight');break;
					}
				});	
		});
		$("#idCardScanBack").on("tap", function() {
			plus.nativeUI.actionSheet({
					cancel: "取消",
					buttons: [{
						title: "拍照"
					}, {
						title: "从相册中选择"
					}]
				},
				function(e) {
					switch(e.index) {
						case 1:getImgFromCamera('idCardScanBack');break;
						case 2:getImgFromGallery('idCardScanBack');break;
					}
				});	
		});
		$("#creditCodeImg").on("tap", function() {
			plus.nativeUI.actionSheet({ 
					cancel: "取消",
					buttons: [{
						title: "拍照"
					}, {
						title: "从相册中选择"
					}]
				},
				function(e) {
					switch(e.index) {
						case 1:getImgFromCamera('creditCodeImg');break;
						case 2:getImgFromGallery('creditCodeImg');break;
					}
				});	
		});
		//拍照
        function getImgFromCamera(id){
        	var camera=plus.camera.getCamera();
        	camera.captureImage(function(path){
                resolveLocalFile(path ,id);
        	});
        }
		//相册
        function getImgFromGallery(id){
            plus.gallery.pick(function(path){
            	resolveLocalFile(path,id);
            });
        }
        //解析本地文件
        function resolveLocalFile(path,id){
     		plus.io.resolveLocalFileSystemURL(path,function(entry){       
                entry.file(function(file){
               	    if( file.size>10*1024*1024 ){
               	    	mui.alert("图片太大，请重新选择！");
               	    	return false;
               	    }else{
               	    	setImg(entry.toLocalURL(),id);
               	    }
               	
                });

    		},function(e){
    			mui.alert("读取照片错误："+e.message);
    		});       	
        }  
        
		function setImg(src,id) {
			convertImgToBase64(src, function(base64Img) {
				var upImg = base64Img.split(",")[1];
				var reqData = {
					'customerIcon': upImg
				};
				var rightImg = 'data:image/jpeg;base64,' + upImg;
				$("#"+id).attr("src", rightImg);
			});
		} 
		
   
		var img;
		function convertImgToBase64(url, callback, outputFormat) {
			var canvas = document.createElement('CANVAS'),
			ctx = canvas.getContext('2d'),
			img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = function() {
				var width = img.width;
				var height = img.height;
				var scale=width/height;
				width=Math.min(800,width);
				height=width/scale;
				canvas.height = height;
				canvas.width = width;
                EXIF.getData(img,function(){
                	var orientation=EXIF.getTag(this,'Orientation');
                	if( orientation!="" && orientation!=1 ){
                		if( orientation==3 ){//旋转180度
							var d=Math.PI;
							ctx.rotate(d);                	
							ctx.drawImage(img, -width, -height,width,height);                        	
                       }else if( orientation==6 ){//顺时针旋转90度
							var d=Math.PI/2;
							canvas.width=height;
							canvas.height=width;
							ctx.rotate(d);                	
							ctx.drawImage(img, 0, -height,width,height);                        	
                        }else if( orientation==8 ){//逆时针旋转90度
							canvas.width=height;
							canvas.height=width;
							var d=3*Math.PI/2;
							ctx.rotate(d);                	
							ctx.drawImage(img, -width, 0,width,height);  
                        }else{//其他方向角暂不处理
                        	ctx.drawImage(img, 0, 0,width,height);
                        }
                        
                	}else{
                		if(height>width){
                        		canvas.width=height;
								canvas.height=width;
								var d=3*Math.PI/2;
								ctx.rotate(d);                	
								ctx.drawImage(img, -width, 0,width,height); 
                        	}else{
                        		ctx.drawImage(img, 0, 0,width,height);
                        	}           
                	}
                	var dataURL = canvas.toDataURL('image/jpeg', 0.3);
					callback.call(this, dataURL);
					canvas = null;   	    
                });
			}; 
		   img.src = url;				
		}
		
		$("#next").on('tap',function(){
			var params = {
				applyMoney: applyMoney,
				loanDate: loanDate,
				payType: payType,
				useType: useType,
				accountNo : accountNo,
				organization : organization,
				applyArea : applyArea,
				commendNo : commendNo,
				creditNo : creditNo,
				registerNo : registerNo,
				checkNo : checkNo,
				organizationNo : organizationNo,
				noCheck : false
			};
			mbank.openWindowByLoad('../taxLoans/creditBookView.html','creditBookView','slide-in-right',params);
		});
		
		$("#cancel").on('tap',function(){
			var bts = ["是", "否"];
				mui.confirm("取消返回首页，是否取消？", "提示", bts, function(e) {
					var i = e.index;
						if(i == 0) {
							mbank.backToIndex(false);
						} else {
							i =0 ;
						}
					});
		});
		mbank.resizePage('.btn_bg_f2');
	});
});