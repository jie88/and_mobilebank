define(function(require, exports, module) {
	// 引入依赖
	var mbank = require('../../core/bank');
	var format = require('../../core/format');

	mui.init();//预加载
	mui.plusReady(function(){
		plus.screen.lockOrientation("portrait-primary");//锁定屏幕为竖屏模式
		var self = plus.webview.currentWebview();
		var f_deposit_acct = self.f_deposit_acct;
		var successFlag = self.successFlag;
		if(!successFlag){
			$("#failDiv").show();
			$("#backBtn").show();
//			$("#continueBtn").show();
			var errorMsg = self.errorMsg;
			$("#msg").html("基金账户签约失败：" + errorMsg);
			//mui.alert(errorMsg);
		}else{
			$("#successDiv").show();
			$("#continueBtn").show();
			$("#riskBtn").show();
		}
		//继续购买
		$("#continueBtn").click(function(){
			//关闭签约页面
			mui.back();
		});
		$("#riskBtn").click(function(){
			plus.webview.close(plus.webview.getWebviewById("fundCustomerSign_Input"));
			if(plus.webview.getWebviewById("fundCustomerSign_Agreement")){
				plus.webview.close(plus.webview.getWebviewById("fundCustomerSign_Agreement"));
			}
			plus.webview.close(plus.webview.getWebviewById("fundCustomerSign_Confirm"));
			var params = {
        		"accountNo":f_deposit_acct
        	};
            mbank.openWindowByLoad("../fund/fundRiskAssessment.html","fundRiskAssessment", "slide-in-right",params);
		});
		//返回基金首页
		$("#backBtn").click(function(){
			if(!successFlag){//签约失败--返回基金首页
				if(plus.webview.getWebviewById("fundmarket")){//基金超市页
					plus.webview.close(plus.webview.getWebviewById("fundmarket"));
				}
				if(plus.webview.getWebviewById("fundProductDetail")){//基金详情页
					plus.webview.close(plus.webview.getWebviewById("fundProductDetail"));
				}
				if(plus.webview.getWebviewById("myHoldFundDetail")){//基金详情页
					plus.webview.close(plus.webview.getWebviewById("myHoldFundDetail"));
				}
				if(plus.webview.getWebviewById("myinvestment")){//我的定投列表
					plus.webview.close(plus.webview.getWebviewById("myinvestment"));
				}
				if(plus.webview.getWebviewById("investmentDetail")){//定投修改
					plus.webview.close(plus.webview.getWebviewById("investmentDetail"));
				}
				if(plus.webview.getWebviewById("changeInvestment")){//定投开通
					plus.webview.close(plus.webview.getWebviewById("changeInvestment"));
				}
				if(plus.webview.getWebviewById("investmentTransferMonthly")){//每月定额转入
					plus.webview.close(plus.webview.getWebviewById("investmentTransferMonthly"));
				}
				if(plus.webview.getWebviewById("fundBuy")){//基金购买
					plus.webview.close(plus.webview.getWebviewById("fundBuy"));
				}
			}
			mui.back();
		});
		
		mui.back=function(){
			plus.webview.close(plus.webview.getWebviewById("fundCustomerSign_Input"));
			if(plus.webview.getWebviewById("fundCustomerSign_Agreement")){//基金签约协议页面
				plus.webview.close(plus.webview.getWebviewById("fundCustomerSign_Agreement"));
			}
			plus.webview.close(plus.webview.getWebviewById("fundCustomerSign_Confirm"));
			plus.webview.close(self);
		}
		
	});
});