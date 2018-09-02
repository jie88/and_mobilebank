define(function(require, exports, module) {
	var mbank = require('../../core/bank');
	var format = require('../../core/format');
	
    var recAccount = "";//中心账户
    
    var collectStyle="";//归集方式
    var collectCircle = "";//归集周期 
    var circleDAY ="";//周期内执行日
    var protocolDate ="";//输入协议生效日期
    var protocolDuring ="";//协议期限
	mui.init();
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var self = plus.webview.currentWebview();
		
		loadAccountList();
		cellectStyleInit();
		cellectCircleInit();
		dayInit();
		weekInit();
		protocolDuringInit();
		function loadAccountList(){
			mbank.getAllAccountInfo(allAccCallBack,2);
			function allAccCallBack(data) {
				var iAccountList = data;
				var accountPickerList = [];
				for( var i=0;i<iAccountList.length;i++ ){
					var pickItem = {
						value:iAccountList[i].accountNo,
						text:iAccountList[i].accountNo
					};
					accountPickerList.push(pickItem);
				}
				var accountPicker = new mui.SmartPicker({title:"请选择中心账户",fireEvent:"accountChange"});
				accountPicker.setData(accountPickerList);
					
				recAccount = iAccountList[0].accountNo;
				document.getElementById("recAccount").innerText = format.dealAccountHideFour(recAccount);
				
				document.getElementById("changeAccount").addEventListener("tap",function(){
					accountPicker.show();
				},false);
			}
		}
		window.addEventListener("accountChange",function(event){
			recAccount = event.detail.value;
			document.getElementById("recAccount").innerText = format.dealAccountHideFour(recAccount);
        });
        
        //归集方式
        function cellectStyleInit(){
        	var collectStyleList = jQuery.param.getParams("COLLECT_STYLE");
			var collectStylePicker = new mui.SmartPicker({title:"请选择归集方式",fireEvent:"pickCollectStyle"});
			collectStylePicker.setData(collectStyleList);
			document.getElementById("changeCollectStyle").addEventListener("tap",function(){
				collectStylePicker.show();
			},false);
			document.getElementById("collectStyle").innerText = "请选择归集方式" ;
		}
		
		window.addEventListener("pickCollectStyle",function(event){
			collectStyle = event.detail.value;
			document.getElementById("collectStyle").innerText = event.detail.text;
        });
        
        //归集周期
        function cellectCircleInit(){
        	var collectCircleList = jQuery.param.getParams("COLLECT_CIRCLE");
			var collectCirclePicker = new mui.SmartPicker({title:"请选择归集周期",fireEvent:"pickCollectCircle"});
			collectCirclePicker.setData(collectCircleList);
			document.getElementById("changeCollectCircle").addEventListener("tap",function(){
				collectCirclePicker.show();
			},false);
			document.getElementById("collectCircle").innerText = "请选择归集周期" ;
		}
		
		window.addEventListener("pickCollectCircle",function(event){
			collectCircle = event.detail.value;
			document.getElementById("collectCircle").innerText = event.detail.text;
			circleDAY = '';
			document.getElementById("collectDay").innerText = "请选择期内执行日" ;
			document.getElementById("collectWeek").innerText = "请选择期内执行日" ;
			if(collectCircle == '2'){
				document.getElementById('changeDay').style.display = 'none';
				document.getElementById('changeWeek').style.display = 'block';
			}else if(collectCircle == '3'){
				document.getElementById('changeWeek').style.display = 'none';
				document.getElementById('changeDay').style.display = 'block';
			}else{
				document.getElementById('changeWeek').style.display = 'none';
				document.getElementById('changeDay').style.display = 'none';
			}
        });
        function dayInit(){
        	var monthList = jQuery.param.getParams("CIRCLEDAY_MONTH");
			var monthPicker = new mui.SmartPicker({title:"请选择期内执行日",fireEvent:"changeDayEvent"});
			monthPicker.setData(monthList);
			document.getElementById("changeDay").addEventListener("tap",function(){
				monthPicker.show();
			},false);
			document.getElementById("collectDay").innerText = "请选择期内执行日" ;
		}
		window.addEventListener("changeDayEvent",function(event){
			circleDAY = event.detail.value;
			document.getElementById("collectDay").innerText = event.detail.text;
        });
        
        function weekInit(){
        	var weekList = jQuery.param.getParams("CIRCLEDAY_WEEK");
			var weekPicker = new mui.SmartPicker({title:"请选择期内执行日",fireEvent:"changeWeekEvent"});
			weekPicker.setData(weekList);
			document.getElementById("changeWeek").addEventListener("tap",function(){
				weekPicker.show();
			},false);
			document.getElementById("collectWeek").innerText = "请选择期内执行日" ;
		}
		window.addEventListener("changeWeekEvent",function(event){
			circleDAY = event.detail.value;
			document.getElementById("collectWeek").innerText = event.detail.text;
        });
        
        function protocolDuringInit(){
        	var protocolDuringList = jQuery.param.getParams("PROTOCOL_DURING");
			var protocolDuringPicker = new mui.SmartPicker({title:"请选择协议期限",fireEvent:"pickProtocolDuring"});
			protocolDuringPicker.setData(protocolDuringList);
			document.getElementById("changeProtocolDuring").addEventListener("tap",function(){
				protocolDuringPicker.show();
			},false);
			document.getElementById("protocolDuring").innerText = "请选择协议期限" ;
		}
		
		window.addEventListener("pickProtocolDuring",function(event){
			protocolDuring = event.detail.value;
			document.getElementById("protocolDuring").innerText = event.detail.text;
        });
        
        $("#changeProtocolDate").on("tap",function(){
			chooseDate("protocolDate");
		});
		function chooseDate(thisId){
			var nowDate = new Date();
			var dDate = new Date();
			var minDate = new Date();
			minDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			dDate.setFullYear(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			plus.nativeUI.pickDate(function(e){
				var d=e.date;
				document.getElementById(thisId).innerText =d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
				protocolDate = format.formatDate(d);
			}, function(e) {
				mui.alert("您没有选择日期","温馨提示");
			}, {
				date: dDate,
				minDate: minDate
			});
		}
		
		document.getElementById("prevButton").addEventListener("tap",function(){
			mui.back();
		},false);
		
		document.getElementById("nextButton").addEventListener("tap",function(){
			if(!recAccount){
				mui.alert("请选择中心账户");
				return;
			}
			if(!collectStyle){
				mui.alert("请选择归集方式");
				return;
			}
			if(!collectCircle){
				mui.alert("请选择归集方式");
				return;
			}
			if(collectCircle == 2 || collectCircle == 3){
				if(!circleDAY){
					mui.alert("请选择周期内执行日");
					return;
				}
			}
			if(!protocolDate){
				mui.alert("请选择协议生效日期");
				return;
			}
			if(!protocolDuring){
				mui.alert("请选择协议期限");
				return;
			}
			
			var params = {
				"recAccount": recAccount,//中心账号
				"collectStyle": collectStyle,//归集方式
				"collectCircle": collectCircle,//归集周期 
				"circleDAY": circleDAY,//周期内执行日
				"protocolDate": protocolDate,//协议生效日期
				"protocolDuring": protocolDuring,//协议期限
				"noCheck": true
			}
			mbank.openWindowByLoad('../cashSweep/cashSweepSetStep3.html','cashSweepSetStep3','slide-in-right',params);
		},false);
	});
});