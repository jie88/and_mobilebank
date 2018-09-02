

<!DOCTYPE html >
<html>
<head >
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-cache" />
<title>湖北银行-个人网上银行</title>
<link href="css_nor/logon_jump.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js_nor/lib/jquery-1.7.2.js"></script>
<script type="text/javascript">
	$(function(){
		$(document).bind('click',function(){
			$("#ebank").css("background-image","url(../images/jump/btn_2.gif)");
			$("#link").css("display","none");
			toggleBtn();
		});
			toggleBtn();

	function toggleBtn(){
		$("#ebank").toggle(function(){
			$(this).css("background-image","url(../images/jump/btn_1.gif)");
			$("#link").css("display","block");
		},function(){
			$(this).css("background-image","url(../images/jump/btn_2.gif)");
			$("#link").css("display","none");
		});
		}
	
	//时间比较
	var time = new Date();
	var month = time.getMonth()+1;
	var day = time.getDate();
	var year = time.getFullYear();
	var a = new Date(year,month,day);
	var b = new Date(2013,9,30);
	if(a>b){
		document.location.href="login.html";	
	}
/* 	function showTime(tDate){
		var month = tDate.getMonth()+1;
		var day = tDate.getDate();
		var year = tDate.getFullYear();
		var stringDate = year+'-'+(month<10 ? "0" + month : month)+'-'+(day<10 ? "0"+ day : day);
		return stringDate;
	} */

	});
	
</script>
</head>
<body >
<div id="Page_content">
<div id="Header">
<div class="login_top">
    <div id="login_logo"></div>   
</div>
</div>
<div id="wrap">
<div id="wrap2">
  <div id="container">
    	<p>湖北银行网上银行已全面升级,新一代网上银行在原有基础上,增加了理财产品、网上缴费、批量转账支付等多项产品和服务。新一代网上银行能让您获得全新的用户体验。</p>
        <div id="btnArea">
        	<table width="663px" height="40px" border="0" cellspacing="0" cellpadding="0">
 <tr >
                <td width="213" align="center">了解新一代个人网上银行可以进入
                </td>
                <td width="213" align="center" style="padding-right: 25px;">已注册新一代个人网上银行
                </td>
                <td width="213" align="left">暂不注册新网银,您于2013年9月30日<br/>
				前仍可以使用原网银
				</td>
</tr>
<tr>
			  <td><a href="javascript:void(0);" onClick="alert('暂未开放');" ><button class="button" style="margin-left:70px;">服务示范</button></a></td>

			  <td><a href="javascript:void(0);" onClick="location= 'login.html';" ><button class="button" style="margin-left:70px;">登&nbsp;&nbsp;录</button></a></td>

			  <td><div><button class="button2" style="margin-left:60px;"  id="ebank">网&nbsp;银</button></div>
		<ul id="link" style="margin-left:60px;">
		<li><a href="javascript:void(0);" onClick="location.href='http://www.hubeibank.cn/';"><button class="button" >湖北网银</button></a></li>
		<li><a href="javascript:void(0);" onClick="location.href='http://www.jzbank.cn/';"><button class="button" >荆州网银</button></a></li>
		<li><a href="javascript:void(0);" onClick="location.href='http://www.bankhs.com.cn/';"><button class="button" >黄石网银</button></a></li>
		<li><a href="javascript:void(0);" onClick="location.href='http://www.yccb.net/';"><button class="button" >宜昌网银</button></a></li>
	</ul>
				</td>
</tr>
            </table>
  </div>
  </div>
</div>
</div>
<div id="footer" ><div>Copyright© 湖北银行 All Rights Reserved.</div></div>
</div>
</form>
</body>
</html>
