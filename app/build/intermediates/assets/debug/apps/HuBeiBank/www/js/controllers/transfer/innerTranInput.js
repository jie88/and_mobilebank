define(function(require, exports, module) {
    var mbank = require('../../core/bank');
    var myAcctInfo = require('../../core/myAcctInfo');
	var format = require('../../core/format');
	//绑定账号列表
	var iAccountInfoList = [];
	var accountPickerList=[];
    var accountPicker;
	//当前选定账号对象
	var currentAcct;
	//是否预约交易，默认非预约
	var scheduleFlag="0";
    var doubtAccFlowNo="";	
    //收款账号是否是信用卡
    var isRecCredit=false;
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self=plus.webview.currentWebview();
      
        if( self.recAccount && self.recAccountName ){
            $("#recAccNo").val(self.recAccount);
            $("#recName").val(self.recAccountName); 
            checkRecAccount(self.recAccount);
        }
		
		$("#bookDate").html(format.formatDate(format.addDay(new Date(),1)));
		queryDefaultAcct();
		function queryDefaultAcct() {
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				iAccountInfoList = data;
				getPickerList(iAccountInfoList);
				var length = iAccountInfoList.length;
				if(length > 0) {
					currentAcct = iAccountInfoList[0];
					$("#accountNo").html(format.dealAccountHideFour(currentAcct.accountNo));
                    qureyBalance();
				}
				
			}
			
		}
		function qureyBalance(){
			myAcctInfo.getAccBalance(currentAcct.accountNo,"true",function(data){
				$("#balance").html(format.formatMoney(data.balanceAvailable));
				if(  isMoney(data.creditUseLimit) && parseFloat(data.creditUseLimit)!=0  ){
					$("#creditUseLimit").html(format.formatMoney(data.creditUseLimit));
					$("#creditUseLimitLi").show();
				}else{
					$("#creditUseLimitLi").hide();
					$("#creditUseLimit").html("0.00");
				}
			});			
		}
		function getPickerList(iAccountInfoList){
			if( iAccountInfoList.length>0 ){
				accountPickerList=[];
				for( var i=0;i<iAccountInfoList.length;i++ ){
					var account=iAccountInfoList[i];
					var pickItem={
						value:i,
						text:account.accountNo
					};
					accountPickerList.push(pickItem);
				}
				accountPicker = new mui.SmartPicker({title:"请选择付款账号",fireEvent:"payAccount"});
			    accountPicker.setData(accountPickerList);	
			}
		}
		
		$("#changeAccount").on("tap",function(){
			document.activeElement.blur();
			accountPicker.show();			
		});

        window.addEventListener("payAccount",function(event){
                var param=event.detail;			
				currentAcct=iAccountInfoList[param.value];
				$("#accountNo").html(format.dealAccountHideFour(currentAcct.accountNo));
				qureyBalance(); 
        });	

        //常用收款人
        $("#commonPayee").on("tap",function(){
        	mbank.openWindowByLoad('commonPayee.html','commonPayee','slide-in-right',{payBookType:"1"});
        });
        
        window.addEventListener("selectPayBook",function(event){
            var payBook=event.detail;
            $("#recAccNo").val(payBook.recAccount);
            $("#recName").val(payBook.recAccountName);
            checkRecAccount(payBook.recAccount);
        });
 
        $("#recAccNo").on("blur",function(){
        	var recAccNo=$(this).val();
            checkRecAccount(recAccNo);
        });
        
        function checkRecAccount( recAccNo ){
        	isRecCredit=false;
        	if( recAccNo.length>=16 && recAccNo.length<=32 ){
        		var cardBin = recAccNo.substring(0,6);
        		if(cardBin == "625850" || cardBin == "628340"){
                    isRecCredit=true;
        		}        		
        	}
        	if( isRecCredit ){
                 $("#bookSwitchLi").hide();
                 $(".bookLi").hide();
                 $("#periodLi").hide();
                 $("#transTimesLi").hide();
        	}else{
         		 $("#bookSwitchLi").show();  
         		 if( scheduleFlag=="1" ){
	         		 $(".bookLi").show();
		             var specifyType=$("input[name='specifyType']:checked").val();
		             if( specifyType=="0" ){
		            	$("#notPeriodLi").show();
		            	$("#periodLi").hide();
		            	$("#transTimesLi").hide();
		             }else{
		            	$("#notPeriodLi").hide();
		              	$("#periodLi").show();
		            	$("#transTimesLi").show();          	
		             }           		 	
         		 }
        		 
        	}        	
        }
 
 		$("#tranAmt").on("focus",function(){
			if($(this).val()){
			  	$(this).val(format.ignoreChar($(this).val(),','));
			}
		    $(this).attr('type', 'number');
		}); 
		$("#tranAmt").on("blur",function(){
			$(this).attr('type', 'text');
			if($(this).val()){
				$(this).val(format.formatMoney($(this).val(),2));
			}
		});
 

        $("#bookSwitch").on("toggle",function(event){
            if(event.detail.isActive){
            	scheduleFlag="1";
            	$(".bookLi").show();
	            var specifyType=$("input[name='specifyType']:checked").val();
	            if( specifyType=="0" ){
	            	$("#notPeriodLi").show();
	            	$("#periodLi").hide();
	            	$("#transTimesLi").hide();
	            }else{
	            	$("#notPeriodLi").hide();
	              	$("#periodLi").show();
	            	$("#transTimesLi").show();          	
	            }            	
            }else{
            	scheduleFlag="0";
            	$(".bookLi").hide();
            	$("#periodLi").hide();
            	$("#transTimesLi").hide();
            }
        });
        
        $("input[name='specifyType']").on("change",function(){
            var specifyType=$("input[name='specifyType']:checked").val();
            if( specifyType=="0" ){
            	$("#notPeriodLi").show();
            	$("#periodLi").hide();
            	$("#transTimesLi").hide();
            }else{
            	$("#notPeriodLi").hide();
              	$("#periodLi").show();
            	$("#transTimesLi").show();          	
            }
        });
 
        $("#pickDate").on("tap",function(){
			plus.nativeUI.pickDate( function(e){
				var bookDate=e.date;
                $("#bookDate").html(format.formatDate(bookDate));
		    },function(e){
			    
			});	
        });
 
        $("#transPeriod").on("change",function(){
        	var transPeriod=$("#transPeriod").val();
        	if( "0"==transPeriod ){
        		$("#transweekDay").hide();
        		$("#transMonthDay").hide();
        	}else if( "1"==transPeriod ){
        		$("#transweekDay").show();
        		$("#transMonthDay").hide();
        	}else{
          		$("#transweekDay").hide();
        		$("#transMonthDay").show();      		
        	}
        });
 
        //是否短信通知收款人标识
        var isNoticeRec=false;
        $("#smsNoticeSwitch").on("toggle",function(event){
            if(event.detail.isActive){
            	isNoticeRec=true;
            	$("#smsNoticeLi").show();
            }else{
            	isNoticeRec=false;
            	$("#smsNoticeLi").hide();
            }
        });
 
		function recAccountCheck(recAccNo){
			if( recAccNo== '' ){
				mui.alert("请输入收款账号！");
				return false;
			}
			var p = /[^\x00-\xff]/g;
			if( p.test(recAccNo) ){
				mui.alert('收款账号不能有中文字符!');
				return false;
			}else if( recAccNo.indexOf(" ")>=0 ){
				mui.alert('收款账号不能有空格!');
				return false;
			}else if(recAccNo.length>32 || recAccNo.length<16){
				mui.alert('收款账号格式不正确!');
				return false;
			}else{
				return true;
			}
		} 
 
	    $("#nextButton").on("tap",function(){
	    	var recAccNo=$("#recAccNo").val();
	    	if( !recAccountCheck(recAccNo) ){
	    		return false;
	    	}
	    	if( currentAcct.accountNo==recAccNo ){
	    		mui.alert("收款账号与付款账号不能为同一个账号！");
	    		return false;
	    	}	    	
	    	var recName=$("#recName").val();
	    	if( ""==recName ){
	    		mui.alert("请输入收款姓名！");
	    		return false;
	    	}	
            var tranAmt=$("#tranAmt").val();
            if( ""==tranAmt ){
            	mui.alert("请输入转账金额！");
            	return false;
            }else{
            	tranAmt=format.ignoreChar($("#tranAmt").val(),',');
            	var balance=format.ignoreChar($("#balance").html(),',');
            	var creditUseLimit=format.ignoreChar($("#creditUseLimit").html(),',');
            	if( !isMoney(tranAmt) || parseFloat(tranAmt)<=0 ){
            		mui.alert("请输入正确的转账金额！");
            		return false;
            	}
            	if( parseFloat(tranAmt)>(parseFloat(balance)+parseFloat(creditUseLimit)) ){
            		mui.alert("可用余额不足!");
            		return false;
            	}
            }
            if( scheduleFlag=="1" ){
            	var bookDate=$("#bookDate").html();
            	if( ""==bookDate ){
            		mui.alert("请选择预约转账日期！");
            		return false;
            	}else{
            		var nowDate=format.formatDate(new Date());
            		if( bookDate<=nowDate ){
            			mui.alert("预约转账日期应晚于今天！");
            			return false;
            		}
            	}
            	var specifyType=$("input[name='specifyType']:checked").val();
            	if( specifyType="1" ){//周期性预约
            		var transTimes=$("#transTimes").val();
            		if( !isInteger(transTimes) || parseInt(transTimes)<=0 ){
            			mui.alert("请输入正确的转账次数！");
            			return false;
            		}
            	}
            }
            if( isNoticeRec ){
            	var recMobile=$("#recMobile").val();
            	if( ""==recMobile ){
            		mui.alert("请输入收款人手机号！");
            		return false;
            	}
            	if( !isMobile(recMobile) ){
            		mui.alert("您输入的手机号码格式不正确！");
            		return false;
            	}
            }
	    	var payRem=$("#payRem").val();
            if( payRem!="" && payRem.length>20 ){
	    		mui.alert("您输入的附言不能超过20个字符！");
	    		return false;
	    	}
	    	var notePhone="";
	    	if( isNoticeRec ){
	    		notePhone=$("#recMobile").val();
	    		if( ""==notePhone ){
	    			mui.alert("请输入收款人手机号码！");
	    			return false;
	    		}
	    	}
	    	var payAmount=format.ignoreChar($("#tranAmt").val(),',');
	    	
            //涉案账户判断
            var url = mbank.getApiURL()+'checkAndRecordDoubtInfo.do';
            var param={
            	payAmount:payAmount,
            	payRem:$("#payRem").val(),
            	payAccount:currentAcct.accountNo,
            	currentBusinessCode:"002008",
            	transferChannel:"1",
            	recAccount:$("#recAccNo").val(),
            	recAccountName:$("#recName").val(),
            	notePhone:notePhone,
            	newPayUse:"行内转账"
            	
            };
			mbank.apiSend("post",url,param,function(data){
				var doubtAccFlag=data.doubtAccFlag;

				if( doubtAccFlag=="1" ){
					mui.alert("收款账户为涉案账户，根据监管要求不得向其转账汇款");
					return false;
				}else if( doubtAccFlag=="2" ){
					doubtAccFlowNo=data.doubtAccFlowNo;
					mui.confirm("收款账户可疑，谨防诈骗！请您确认是否继续转账？","提示",["确认","取消"], function(e) {
					if (e.index == 0) {
						tranConfirm();	
					} });
				}else{
					tranConfirm();
				}
				
			},function(data){
				mui.alert(data.em);
			},true);	    	
	    	
	    	function tranConfirm(){
	    		if(isRecCredit){
	    			creditConfirm();
	    		}else{
	    			debitConfirm();
	    		}
	    		
	    	}
	    	//借记卡转借记卡
	        function debitConfirm(){
		    	var params={
		    		payAccount:currentAcct.accountNo,
		    		recAccount:$("#recAccNo").val(),
		    		recAccountName:$("#recName").val(),
		    		payAmount:payAmount,
		    		specifyType:$("input[name='specifyType']:checked").val(),
		    		scheduleFlag:scheduleFlag,
		    		transPeriod:$("#transPeriod").val(),
		    		transweekDay:$("#transweekDay").val(),
		    		transMonthDay:$("#transMonthDay").val(),
		    		transTimes:$("#transTimes").val(),
		    		specifyDate:$("#bookDate").html(),
		    		specifyCycleTime:$("#specifyCycleTime").val(),
		    		specifyDateTime:$("#specifyDateTime").val(),
		    		notePhone:notePhone,
		    		payRem:$("#payRem").val(),
		    		transferType:"0",
		    		transferChannel:"1",
		    		accountStat:currentAcct.accountStat,
		    		doubtAccFlowNo:doubtAccFlowNo
		    	};
		    	var url = mbank.getApiURL()+'innerTransfer_confirm.do';
		    	mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    	function successCallback(data){
			        mbank.openWindowByLoad('../transfer/innerTranConfirm.html','innerTranConfirm','slide-in-right',data);
			    }
		    	function errorCallback(data){
		    		mui.alert(data.em);
			    }        	
	        }
    
	    	//借记卡转信用卡
	        function creditConfirm(){
		    	var params={
		    		payAccount:currentAcct.accountNo,
		    		recAccount:$("#recAccNo").val(),
		    		recAccountName:$("#recName").val(),
		    		payAmount:payAmount,
		    		payRem:$("#payRem").val()
		    	};
		    	var url = mbank.getApiURL()+'debitCard.do';
		    	mbank.apiSend("post",url,params,successCallback,errorCallback,true);
		    	function successCallback(data){
			        mbank.openWindowByLoad('../transfer/innerTranConfirm.html','innerTranConfirm','slide-in-right',data);
			    }
		    	function errorCallback(data){
		    		mui.alert(data.em);
			    }        	
	        }    
    
	    });
	    
        window.addEventListener("reload",function(event){
           qureyBalance();
        });

        mbank.resizePage(".btn_bg_f2");
	});

});