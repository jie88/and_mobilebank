
















 

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 

<html>
<head>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>湖北银行个人网上银行</title>
	<!--[if lt IE 9]><script type="text/javascript" src="js_nor/lib/excanvas.js"></script><![endif]-->
	<link href="css_nor/public.css" rel="stylesheet">
	<link href="css_nor/main.css" rel="stylesheet">
	<link href="css_nor/calendar.css" rel="stylesheet">
	<link href="css_nor/carousel.css" rel="stylesheet">
	<link href="css_nor/displayer.css" rel="stylesheet">
	<link href="css_nor/overview.css" rel="stylesheet">
	<link href="css_nor/base.css" type="text/css" rel="stylesheet" />
	<link href="css_nor/default/frame_default.css" rel="stylesheet">
	<link href="css_nor/default/table.css" rel="stylesheet">
	<link href="css_nor/default/text.css" rel="stylesheet">
	<link href="css_nor/index.css" type="text/css" rel="stylesheet" />
	<link href="css_nor/others.css" type="text/css" rel="stylesheet" />
	<link href="css_nor/extend.css" type="text/css" rel="stylesheet" />
	<link href="css_nor/default/error.css" rel="stylesheet">
	<link href="css_nor/tree.css" rel="stylesheet">
	<script type="text/javascript">
		/**
		* 限制右键。
		*/
		document.oncontextmenu = function () {
 			return false;
		};
	
		var session_timeout=14;
		left_timeout=0;
		var autoOutTimer=null;
		function initAutoOutTimer(){
			window.clearInterval(autoOutTimer);
			left_timeout=(session_timeout-1)*60;
			autoOutTimer=window.setInterval(timeCounterUpdate,1000);
		}
		function timeCounterUpdate(){
			left_timeout--;
			if(left_timeout<0){
				openCommWindow({
				 	tranCode:'auto_out',
				 	sizeType:'small',
				 	title:'湖北银行个人网上银行'
				 });
				window.clearTimeout(autoOutTimer);
			}
		}
		initAutoOutTimer();

		var autoExistFlag=false;
	</script>
	
<script>
//初始化
function init(){
	
 	$(window).bind('unload',function(){
		$.lily.ajax({
		    url: 'userSignOff.html',
	        type: 'post',
	        data:{},
	        async: false
		}).htmlne(function(data) {
		})
		if(autoExistFlag==false && $.lily.sessionData.session_mastSafe=='2'){
			alert("您将要退出个人网银系统，为了安全起见，建议您拔出USBKEY证书。");
		}
	}); 
 	
 	
	
	
	
	$.lily.ajax({
		url : 'getBankNotice.html',
		type : 'post',
		dataType : 'json',
		processResponse : function(data) {
			var bankNoticeList = data.iBankNotice;
			var totalNum = data.turnPageTotalNum;
			var size = bankNoticeList.length;
			var bankNoticeDIV = $("#bankNoticeDIV");
			if(size<1){
				bankNoticeDIV.append($('<li><span>暂无银行公告</span></li>'));
			}else{
				$.each(bankNoticeList,function(i){
					var ss = bankNoticeList[i].messageTitle;
					var dd = bankNoticeList[i].messageId;
					var cc = $('<li><a href="#" id="nDetail_'+dd+'"><span>【公告】</span>'+ss+'</a></li>');
					bankNoticeDIV.append(cc);
					$('#nDetail_'+dd).click(function(){
						openCommWindow({
							tranCode:'bankNoticeDetail',
							param:{"messageId":dd},
							title:'公告详情'
						});
					});
					
				});
			}
		}
	});
	
	
	var myInfoUL = $("#myInfoUL");
	var cstName = $.lily.sessionData.session_customerNameCN;
	var preMessage = $.lily.sessionData.customerMessage;
	var customerLastLogon = $.lily.sessionData.customerLastLogon;
	
	if(preMessage==null || preMessage.length==0){
		preMessage = "";
	}
	if(customerLastLogon==null || customerLastLogon.length.length==0){
		customerLastLogon = "";
	}
		
	
// 	var y = customerLastLogon.substring(0,4);
	
	var aaa = $('<li><span class="user">'+cstName+'</span>, 欢迎您！</li>');
	var bbb = $('<li>预留信息: '+preMessage+'</li>');
	var ccc = $('<li class="myinfo_ico">上次登录时间: '+formatShowDateTime(customerLastLogon)+'</li>');
	
	myInfoUL.append(aaa);
	myInfoUL.append(bbb);
	myInfoUL.append(ccc);
	
	
	zc1_close();
	zc2_close();
	zc3_close();
	$("#zc1tbody").empty();
	$("#zc1sum").empty();
	$("#zc2tbody").empty();
	$("#zc2sum").empty();
	$("#zc3tbody").empty();
	$("#zc3sum").empty();
	zc1open();
	zc2open();
 	zc3open();
 
 	
    
	
	
	
}

function signOut(){
	if( !window.confirm('您确定要退出个人网上银行吗?') ){
		return ;
	}
	goToLogin();
}

function goToLogin(){
	window.location.href = 'login.html';
}
function moreNews()
{
	$.htmlDispatch("bankNotice", "银行公告","公告列表");
}
function kanggou()
{
	refrashSession();
	$('#myInfoUL').text('');
	$('#bankNoticeDIV').text('');
	init();
}

function showOnlineCust(obj){
	window.open('http://192.168.10.160:8205/webchatclient/chat.html?customno='+obj,'newwindow','heigth=660,width=870,top=0,left=300,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no','window');
// 	window.showModalDialog('http://192.168.10.160:8205/webchatclient/chat.html?customno='+obj,window,'dialogHeight:660px;dialogWidth:870px;dialogTop:0px;dialogLeft:300px;edge:Raised;center:yes;help:No;resizable:Yes;status:Yes;');
}
function refresh(){
	refrashSession();
	$('#myInfoUL').text('');
	$('#bankNoticeDIV').text('');
	init();
}
function Get_IE_Version(){
	var v;
	if(navigator.userAgent.indexOf("MSIE 6.0")>0){
		v=6;
	}else if(navigator.userAgent.indexOf("MSIE 7.0")>0){
		v=7;
	}else if(navigator.userAgent.indexOf("MSIE 8.0")>0){
		v=8;
	}
		return v;
}
</script>
</head>
<!--JQ 轮播广告-->
<script type="text/javascript" src="js_nor/common.js"></script>
<script type="text/javascript" src="js_nor/jquery.pack.js"></script>
<script type="text/javascript" src="js_nor/jQuery.blockUI.js"></script>
<script type="text/javascript" src="js_nor/jquery.SuperSlide.js"></script>
<body style="overflow-x:hidden,overflow-y:hidden" id='htmlbody'  onload="init();">

<!--头部logo区-->

<div class="main_head">
<div class="logo">
       <div class="logo_ico" id="headerSysTool">
          <ul>
          



            <li><a href="#" onclick="showOnlineCust('PB1000000417');" class="ico1">在线客服</a></li>
            <li><a href="javascript:signOut()" class="ico2"  id="icon_exit">安全退出</a></li>
            <div class="clear"></div>
          </ul>           
       </div>
</div>
		<div id="menu-area">
			<div id="menu-container">
				<div  id="menu">
				    <ul id="nav" data-toggle="buttons-radio">
				    <li class="menu_line"></li>
				    <li data-toggle="button" id="showWelcomBtn">
				    <a href="javascript:refresh()" id="mynav0" class="nav_on"><span>我的首页</span></a></li>
				    <li class="menu_line"></li>
				   	<li><a onclick="javascript:qiehuan(this)" id="mynav001" class="nav_off"><span>我的账户</span></a></li><li class="menu_line"></li><li><a onclick="javascript:qiehuan(this)" id="mynav002" class="nav_off"><span>转账汇款</span></a></li><li class="menu_line"></li><li><a onclick="javascript:qiehuan(this)" id="mynav003" class="nav_off"><span>缴费支付</span></a></li><li class="menu_line"></li><li><a onclick="javascript:qiehuan(this)" id="mynav005" class="nav_off"><span>个人贷款</span></a></li><li class="menu_line"></li><li><a onclick="javascript:qiehuan(this)" id="mynav009" class="nav_off"><span>理财产品</span></a></li><li class="menu_line"></li><li><a onclick="javascript:qiehuan(this)" id="mynav025" class="nav_off"><span>我的储蓄</span></a></li><li class="menu_line"></li><li><a onclick="javascript:qiehuan(this)" id="mynav026" class="nav_off"><span>我的网银</span></a></li><li class="menu_line"></li><li><a onclick="javascript:qiehuan(this)" id="mynav027" class="nav_off"><span>安全中心</span></a></li><li class="menu_line"></li>
				    </ul>
				    <div id=menu_con>
				      <div id="qh_con0" style="display: block">
				      <ul>
				      </ul></div> 
				      
										<div id="qh_con009" style="display: none;"><ul><li data-toggle="lilyMenu" data-content="009003_financing_buy" class="btn"><a href="#"><span>理财产品信息</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="009002_risk_check" class="btn"><a href="#"><span>风险评估</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="009006_ownproduct_query" class="btn"><a href="#"><span>我的理财</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="009007_todaysale_query" class="btn"><a href="#"><span>当前委托/撤销</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="009008_historysale_query" class="btn"><a href="#"><span>历史查询</span></a></li><li class=menu_line2></li></ul></div><div id="qh_con005" style="display: none;"><ul><li data-toggle="lilyMenu" data-content="005006_personalLoanQuery" class="btn"><a href="#"><span>个人贷款查询</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="005007_loanCounter" class="btn"><a href="#"><span>贷款试算</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="005009_problemFeedback" class="btn"><a href="#"><span>反馈问题</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="005008_show" class="btn"><a href="#"><span>个贷产品展示</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="005010_personalLoanApply" class="btn"><a href="#"><span>个人贷款申请</span></a></li><li class=menu_line2></li></ul></div><div id="qh_con025" style="display: none;"><ul><li data-toggle="lilyMenu" data-content="002004_transfer" class="btn"><a href="#"><span>定活互转</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="002005_transfer" class="btn"><a href="#"><span>通知存款</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="025011_transfer" class="btn"><a href="#"><span>智能通知存款</span></a></li><li class=menu_line2></li></ul></div><div id="qh_con026" style="display: none;"><ul><li data-toggle="lilyMenu" data-content="mybank" class="btn"><a href="#"><span>用户名设置</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="bankLog" class="btn"><a href="#"><span>网银操作日志</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="noteSignPact" class="btn"><a href="#"><span>短信签约</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="026004_quickMenu" class="btn"><a href="#"><span>快捷菜单设置</span></a></li><li class=menu_line2></li></ul></div><div id="qh_con027" style="display: none;"><ul><li data-toggle="lilyMenu" data-content="safeCenter" class="btn"><a href="#"><span>安全设置</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="limitSet" class="btn"><a href="#"><span>交易限额设置</span></a></li><li class=menu_line2></li></ul></div><div id="qh_con001" style="display: none;"><ul><li data-toggle="lilyMenu" data-content="001003_accountManage" class="btn"><a href="#"><span>账户管理</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="001001_accountOverview" class="btn"><a href="#"><span>账户概览</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="001002_accountDebitTranDetail" class="btn"><a href="#"><span>交易明细查询</span></a></li><li class=menu_line2></li></ul></div><div id="qh_con002" style="display: none;"><ul><li data-toggle="lilyMenu" data-content="002008_transfer" class="btn"><a href="#"><span>行内转账</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="002009_transfer" class="btn"><a href="#"><span>跨行转账</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="002016_batchManual" class="btn"><a href="#"><span>批量转账</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="002002_transfer" class="btn"><a href="#"><span>预约管理</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="002017_transferQuery" class="btn"><a href="#"><span>批量转账查询</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="002007_transferDetailQuery" class="btn"><a href="#"><span>转账结果查询</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="002006_recBook" class="btn"><a href="#"><span>收款人名册维护</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="002018_recBankQuery" class="btn"><a href="#"><span>联行号查询</span></a></li><li class=menu_line2></li></ul></div><div id="qh_con003" style="display: none;"><ul><li data-toggle="lilyMenu" data-content="003003_preFeePayment" class="btn"><a href="#"><span>网上缴费</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="003002_charge_query" class="btn"><a href="#"><span>缴费支付查询</span></a></li><li class=menu_line2></li><li data-toggle="lilyMenu" data-content="003005_charge_set" class="btn"><a href="#"><span>网上缴费设置</span></a></li><li class=menu_line2></li></ul></div>  
				      </div>
      			</div>
			</div>
		</div>
<!--导航 END-->
</div>
	<!--内容-->
<div class="main_body">
	<div id="right-welcome-area" class="wapper">
	
		   <!--我的信息-->
	       <div class="left_box">
	           <div class="myinfo_title"></div>
	           <div class="myinfo_text">
	             <ul id="myInfoUL">
	             </ul>
	           </div>
	           <div class="box_bottom"></div>       
	       </div>
	       <!--我的信息END-->
	       
	      <!--广告栏-->
	      <div class="movie">
	          <div id="slideBox" class="slideBox">
	              <div class="hd">
	                  <ul><li>1</li><li>2</li></ul>
	              </div>
	              <div class="bd">
	                  <ul>
	                      <!--  <li><a><img src="../images/ad1.jpg" /></a></li> -->
	                      <li><a><img src="../images/ad2.jpg" /></a></li>
	                      <li><a><img src="../images/ad3.jpg" /></a></li>
	                  </ul>
	              </div>
	          </div>
	          <script type="text/javascript">jQuery(".slideBox").slide( { mainCell:".bd ul",effect:"left",autoPlay:true} );</script>
	       </div>
	       <!--广告栏END-->
	      <div class="h10"></div>
	      <!--银行公告最新提醒-->
	      <div class="left_box">
	      
	           <div class="bankgg_title"><a href="javascript:moreNews();">更多>></a></div>
	           <div class="bankgg_text" >
	              <ul id="bankNoticeDIV">
	              </ul>
	           </div>
	           <div class="box_bottom"></div>
	           
	           <div class="h10"></div>
	           
	          <div class="zxtx_title" id="zxtx_title" style="display:none"><!-- <a>更多>></a> --></div>
	           <div class="zxtx_text" >
	              <ul>
	               <li id="zxtxcunkuan" style="display:none"><span>您有【<b></b>】笔存款即将到期</span></li>
	               <li id="zxtxlicai" style="display:none"><span>您有【<b></b>】笔理财产品即将到期</span></li>
	               <li id="zxtxdaikuan" style="display:none"><span>您有【<b></b>】笔个人贷款即将到期</span></li>
	              </ul>
	           </div>
	           <div class="box_bottom" id="zxtx_bottom" style="display:none"></div>
	                 
	       </div>
	       <!--银行公告最新提醒END-->
	       <!--资产负债-->
	       <div class="right_box">
	       
	           <div class="zcfz_title"></div>
	           <div class="zcfz_text">
	             <ul>
	             	<div class="zc_title">资产<span>（存款类资产）</span></div>
	                <!--账户表格-->
	                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="account" id="zc1" style="display:none">
	                 	<colgroup>
	                 	<col width="25%">
						<col width="10%">
						<col width="7%">
						<col width="10%">
						<col width="15%">
						<col width="15%">
						<col width="8%">
						<col width="10%">
	                  </colgroup>
	                  <thead>
						<tr align="center" class="table_head" id="zc1tableHead"  >
	                    	<td>账号</td>
	                     	<td>储种</td>
	                     	<td>存期</td>
	                     	<td>利率(%)</td>
	                     	<td>起息日</td>
	                     	<td>到期日</td>
	                     	<td>币种</td>
	                     	<td>金额(元)</td>
	                  </tr>
	                  </thead>
	                  <tbody id="zc1tbody"></tbody>
	                </table>
	                <div class="zc_bottom">
	                	<ul>
	                	   <li class="left">
	                    	<a id="close1" style="display:none" onclick="javascript:zc1_close()"><img src="../images/zc_close.jpg" /></a>
	                    	<a id="open1" onclick="javascript:zc1_open()"><img src="../images/zc_open.jpg" /></a>
	                    	</li>
	                       <li id="zc1sum" class="right red"></li>
	                       <!-- <a href="#" id="zc1more" name="zc1more" onclick="accountOverview()" style="display: none">更多>></a> -->
	                    </ul>
	                </div> 
	                
	                <div class="h10"></div>
	                
	                <div class="zc_title">资产<span>（持有理财产品）</span></div>
	                <!--账户表格-->
	                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="account" id="zc2" style="display:none">
	                  	<col width="25%">
						<col width="25%">
						<col width="13%">
						<col width="13%">
						<col width="9%">
						<col width="15%">
	                  <thead>
						<tr align="center" class="table_head" id="zc2tableHead" >
							<td>产品代码</td>
							<td>产品名称</td>
							<td>产品起息日</td>
							<td>产品到期日</td>
							<td>币种</td>
							<td>持有金额(元)</td>
						</tr>
					</thead>
		           <tbody id="zc2tbody"></tbody>
	                </table>
	                <div class="zc_bottom">
	                	<ul>
	                	   <li class="left">
	                    	<a id="close2" style="display:none" onclick="javascript:zc2_close()"><img src="../images/zc_close.jpg" /></a>
	                    	<a id="open2" onclick="javascript:zc2_open()"><img src="../images/zc_open.jpg" /></a></li>
	                       <li id="zc2sum" class="right red"></li>
	                       <!-- <a href="#" id="zc2more" name="zc2more" onclick="ownproduct_query()" style="display: none">更多>></a> -->
	                    </ul>
	                </div>  
	               
	                <div class="h10"></div>
	                
	                <div class="zc_title">负债<span class="green">（个人贷款）</span></div>
	                <!--账户表格-->
	                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="account" id="zc3" style="display:none">
	                  	<col width="25%">
						<col width="25%">
						<col width="13%">
						<col width="13%">
						<col width="9%">
						<col width="15%">
						<thead>
							<tr align="center" class="table_head" id="zc3tableHead"  >
								<td>贷款账号</td>
								<td>借据品种</td>
								<td>贷款开始日期</td>
								<td>贷款结束日期</td>
								<td>币种</td>
								<td>贷款余额(元)</td>
									
							</tr>
						</thead>
						<tbody id="zc3tbody"></tbody>
	                </table>
	                <div class="zc_bottom">
	                	<ul>
	                	   <li class="left">
	                    	<a id="close3" style="display:none" onclick="javascript:zc3_close()"><img src="../images/zc_close.jpg" /></a>
	                    	<a id="open3" onclick="javascript:zc3_open()"><img src="../images/zc_open.jpg" /></a></li>
	                       <li id="zc3sum" class="right green"></li>
	                       <!-- <a href="#" id="zc3more" name="zc3more" onclick="personalLoanQuery()" style="display: none">更多>></a> -->
	                    </ul>
	                </div>         
	             </ul>
	           </div>
	           <div class="box_bottom2"></div>       
	       
	       </div>
		   <!--资产负债END-->
	       <div class="h10"></div>
	       
	       <!--功能菜单-->
	       <div class="function_title"><a href="javascript:showTranArea('026004_quickMenu' ,'我的网银' ,'快捷菜单设置')"><img src="../images/ico1.jpg"/></a></div>
	       <div class="function_ico">
	          <ul>
	          	
 	             
	            
    				<li><a class="ico1"  href="javascript:showTranArea('001003_accountManage' ,'我的账户' ,'账户管理')">账户管理</a></li>
    						
    				
    				
	            
    				<li><a class="ico2"  href="javascript:showTranArea('001001_accountOverview' ,'我的账户' ,'账户概览')">账户概览</a></li>
    						
    				
    				
	            
    				
	            
	            
	             
	            
    				
	            
    				
	            
    				
	            
    				
	            
    				
	            
    				<li><a class="ico3"  href="javascript:showTranArea('002007_transferDetailQuery' ,'转账汇款' ,'转账结果查询')">转账结果查询</a></li>
    						
    				
    				
	            
    				
	            
    				
	            
	            
	             
	            
    				<li><a class="ico4"  href="javascript:showTranArea('003003_preFeePayment' ,'缴费支付' ,'网上缴费')">网上缴费</a></li>
    						
    				
    				
	            
    				
	            
    				
	            
	            
	             
	            
    				
	            
    				
	            
    				
	            
    				
	            
    				
	            
	            
	             
	            
    				
	            
    				
	            
    				<li><a class="ico5"  href="javascript:showTranArea('009006_ownproduct_query' ,'理财产品' ,'我的理财')">我的理财</a></li>
    						
    				
    				
	            
    				
	            
    				
	            
	            
	             
	            
    				<li><a class="ico6"  href="javascript:showTranArea('002004_transfer' ,'我的储蓄' ,'定活互转')">定活互转</a></li>
    						
    				
    				
	            
    				<li><a class="ico7"  href="javascript:showTranArea('002005_transfer' ,'我的储蓄' ,'通知存款')">通知存款</a></li>
    						
	            <div class="clear"></div> 
	          </ul>           
	       </div>
	       <div class="box_bottom3"></div> 
	       <!--功能菜单END-->
		
	</div>	
	<!--主交易区-->
		<div id="right-main-area" class="wapper" style="display:none">
             <div class="main_title" id="currentPath">
             </div>
             <div class="main_box" id="right-main-content">
             </div>
	         <!--下边框 -->
	         <div class="box_bottom3">
	         </div>
         </div>
	<!--主交易区END-->
	<!--内容END-->
	<div class="h20"></div>
	
	<!--foot区-->
	<div class="foot_box">Copyright© 湖北银行 All Rights Reserved. </div>
	<!--foot区END-->
	</div>	
	<script src="js_nor/lib/jquery-1.7.2.js"></script>
	<script src="js_nor/lib/PassGuardCtrl.js"></script>
	<script src="js_nor/lily.core.js"></script>
	<script src="js_nor/lily.mouse.js"></script>
	<script src="js_nor/lily.draggable.js"></script>
	<script src="js_nor/lily.mainPanel.js"></script>
	<script src="js_nor/lily.transition.js"></script>
	<script src="js_nor/lily.tooltip.js"></script>
	<script src="js_nor/lily.popover.js"></script>
	<script src="js_nor/lily.slider.js"></script>
	<script src="js_nor/calendar/calendar.js"></script>
	<script src="js_nor/calendar/selCalendar.js"></script>
	<script src="js_nor/lily.button.js"></script>
	<script src="js_nor/lily.switch.js"></script>
	<script src="js_nor/lily.popup.js"></script>
    <script src="js_nor/lily.carousel.js"></script>
    <script src="js_nor/lily.displayer.js"></script>
    <script src="js_nor/lily.placeholder.js"></script>
    <script src="js_nor/lily.mvc.js"></script>
    <script src="js_nor/lily.window.js"></script>
<!--     <script src="js_nor/lily.accountSelect.js"></script> -->
    <script src="js_nor/lily.recBook.js"></script>
    <script src="js_nor/lily.recBank.js"></script>    
    <script src="js_nor/lily.createPayBookGroup.js"></script>
    <script src="js_nor/lily.modifyPayBookGroup.js"></script>    
    <script src="js_nor/lily.table.js"></script>
    <script src="js_nor/lily.format.js"></script>
    <script src="js_nor/lily.param.js"></script>
    <script src="js_nor/lily.taskbar.js"></script>
    <script src="js_nor/lily.validator.js"></script>
    <script src="js_nor/lily.panelEditor.js"></script>
    <script src="js_nor/lily.widget.js"></script>
    <script src="js_nor/lily.scrollbar.js"></script>
    <script src="js_nor/lily.fileuploader.js"></script>
    <script src="js_nor/lily.guider.js"></script>
    <script src="js_nor/lily.print.js"></script>
    <script src="js_nor/lily.filedownloader.js"></script>  
    <script src="js_nor/lily.userAuth.js"></script>  
    <script src="js_nor/lily.dispatch.js"></script>  
    <script src="js_nor/lily.mapTree.js"></script>  
    <script src="js_nor/lily.tree.js"></script>  
    <script src="js_nor/lily.tipWindow.js"></script>
    <script type="text/javascript">
		$( function() {
        	$.lily.CONFIG_SESSION_ID = 'CBJAGCHJEGIFCFBEAFAGHPHLCVDJCAJSIDBQAHCC';
        })
    </script>
    
    <script src="js_nor/lily.initializer.js"></script>
    <script src="js_nor/frontpage/public/perbank.js"></script>
    <script src="js_nor/frontpage/public/perbank.error.js"></script>
    <script src="js_nor/frontpage/perbank.js"></script> 
    <script src="js_nor/application.js"></script>
    <script src="js_nor/lily.3DTransform.js"></script>
    <script src="js_nor/KeyCodeControl.js"></script>
    <script src="js_nor/chart/lily.pieChart.js"></script>
    <script src="js_nor/lily.menu.js"></script>

    
  	 

<script type="text/javascript">
var bankCertDN = 'CN=certRequisition,O=CFCA TEST CA,C=CN'
function initCSP() {
	FindProviders();
}
/*
 * 查找所有CSP
 */
function FindProviders(){
	try{
		indexEnhanced = 0;
		var cryptprov = document.getElementById("cspSelect");

		for(var i=0;i<cryptprov.length;i++){
			cryptprov.remove(i);
		}
		var cspInfo = CryptoAgent.CFCA_GetCSPInfo();
		var csps = cspInfo.split("||");
	    if(cspInfo.indexOf('Microsoft Enhanced Cryptographic Provider v1.0') != -1)
        {
            var opt = document.createElement("OPTION");
            opt.value = "Microsoft Enhanced Cryptographic Provider v1.0";
			opt.text = "Microsoft Enhanced Cryptographic Provider v1.0";
            cryptprov.add(opt);
		}
		for(var i=0;i<csps.length;i++){					
            if((-1==csps[i].indexOf("Microsoft")))
            {
                var opt = document.createElement("OPTION");
				opt.value = csps[i];
				opt.text = csps[i];
				cryptprov.add(opt);
			}
		}
		cryptprov.selectedIndex = indexEnhanced;
	}catch(e){
		alert("初始化CSP失败");
	}
}
function getPKCS10() {
	var pkcs10req = CreatePKCS10();
	return pkcs10req;
}
/*
 * 生成单证PKCS10请求
 */
function CreatePKCS10() {
	try 
    {
		var keyAlgorithm = "RSA";
		var uType = document.getElementById('USBKeyTypeSEL').value;
		var keyLength;
		if(uType == '001'){
			keyLength = "2048";
		}else{
			keyLength = getUSBKeyKeyLength();
		}
		var cspName = document.getElementById("cspSelect").value;
	    //var strSubjectDN = "CN=certRequisition,O=CFCA TEST CA,C=CN";  //证书主题
	    var strSubjectDN = bankCertDN;  //证书主题
	    var res1 = CryptoAgent.CFCA_SetCSPInfo(keyLength, cspName);
		var res2= CryptoAgent.CFCA_SetKeyAlgorithm(keyAlgorithm);
		//RSA单证
		var pkcs10Requisition = CryptoAgent.CFCA_PKCS10CertRequisition(strSubjectDN, 1, 1);
		return pkcs10Requisition;
    }
    catch (e)
    {
    	alert("生成PKCS10请求失败");
    }
}

/*
 * 生成密钥容器
 */
function CFCA_GetContainer(){
	return CryptoAgent.CFCA_GetContainer();
}

/*
 * 安装证书
 */
function InstallCert(cspName,signCert,containerName,uType)
{
	try 
    {
        if(cspName == "")
        {
            alert("获取CSP名称出错");
            return;
        }
        if(signCert == "")
        {
            alert("获取签名公钥证书内容出错");
            return;
        }
        if(containerName == "")
        {
            alert("获取密钥容器名称内容出错");
            return;
        }  
    	var keyAlgorithm  = "RSA";
    	var keyLength;
    	if(uType == '001'){
    		keyLength = "2048";
    	}else{
    		keyLength = getUSBKeyKeyLength();
    	}
        CryptoAgent.CFCA_SetKeyAlgorithm(keyAlgorithm);
    	CryptoAgent.CFCA_SetCSPInfo(keyLength,cspName);
        
    	CryptoAgent.CFCA_ImportSignCert(1,signCert, containerName);  
    	return "0";//安装成功：返回0
    }
    catch (e)
    {
        return "";//安装失败：返回空值
    }
}

/*
 * 获取USBKey算法长度
 */
function getUSBKeyKeyLength(){
	try 
    {
		var usbKeyCtrl = $.USBKeyCtrl();
		var usbKeySN = usbKeyCtrl.GetKeyCtrl().GetUsbkeySN();
		var usbtype = usbKeyCtrl.GetKeyCtrl().usbtype;
		if(usbtype == '798'){
			return "2048";
		}else{
			return "1024";
		}
    }
	catch (e)
	{
		alert("获取USBKey算法长度失败");
	} 
}
</script>
     <script src="js_nor/lily.usbkeyUtil.js"></script>  
     <script type="text/javascript">	
		$( function() {
			$('#menu-container').menu();
    		$('body').dispatch();
        })
    </script>
    
    
    <script type="text/javascript">	
		var enableBsnJson=[{bsnCode:'001003',bsnName:'账户管理',action:'001003_accountManage'},{bsnCode:'001001',bsnName:'账户概览',action:'001001_accountOverview'},{bsnCode:'001002',bsnName:'交易明细查询',action:'001002_accountDebitTranDetail'},{bsnCode:'002008',bsnName:'行内转账',action:'002008_transfer'},{bsnCode:'002009',bsnName:'跨行转账',action:'002009_transfer'},{bsnCode:'002016',bsnName:'批量转账',action:'002016_batchManual'},{bsnCode:'002002',bsnName:'预约管理',action:'002002_transfer'},{bsnCode:'002017',bsnName:'批量转账查询',action:'002017_transferQuery'},{bsnCode:'002007',bsnName:'转账结果查询',action:'002007_transferDetailQuery'},{bsnCode:'002006',bsnName:'收款人名册维护',action:'002006_recBook'},{bsnCode:'002018',bsnName:'联行号查询',action:'002018_recBankQuery'},{bsnCode:'003003',bsnName:'网上缴费',action:'003003_preFeePayment'},{bsnCode:'003002',bsnName:'缴费支付查询',action:'003002_charge_query'},{bsnCode:'003005',bsnName:'网上缴费设置',action:'003005_charge_set'},{bsnCode:'005006',bsnName:'个人贷款查询',action:'005006_personalLoanQuery'},{bsnCode:'005007',bsnName:'贷款试算',action:'005007_loanCounter'},{bsnCode:'005009',bsnName:'反馈问题',action:'005009_problemFeedback'},{bsnCode:'005008',bsnName:'个贷产品展示',action:'005008_show'},{bsnCode:'005010',bsnName:'个人贷款申请',action:'005010_personalLoanApply'},{bsnCode:'009003',bsnName:'理财产品信息',action:'009003_financing_buy'},{bsnCode:'009002',bsnName:'风险评估',action:'009002_risk_check'},{bsnCode:'009006',bsnName:'我的理财',action:'009006_ownproduct_query'},{bsnCode:'009007',bsnName:'当前委托/撤销',action:'009007_todaysale_query'},{bsnCode:'009008',bsnName:'历史查询',action:'009008_historysale_query'},{bsnCode:'025004',bsnName:'定活互转',action:'002004_transfer'},{bsnCode:'025005',bsnName:'通知存款',action:'002005_transfer'},{bsnCode:'025011',bsnName:'智能通知存款',action:'025011_transfer'},{bsnCode:'026001',bsnName:'用户名设置',action:'mybank'},{bsnCode:'026002',bsnName:'网银操作日志',action:'bankLog'},{bsnCode:'026003',bsnName:'短信签约',action:'noteSignPact'},{bsnCode:'026004',bsnName:'快捷菜单设置',action:'026004_quickMenu'},{bsnCode:'027001',bsnName:'安全设置',action:'safeCenter'},{bsnCode:'027002',bsnName:'交易限额设置',action:'limitSet'}];
		var custType = 01
		var enableActionSpecil=['002016_batchFile','001003_addDebitAccount','025013_transfer','bankNotice'];
    </script>
	</body>
</html>
