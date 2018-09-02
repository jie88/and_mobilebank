












 

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!DOCTYPE html>
<html lang="zh">
<head>
	<META http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>湖北银行个人网上银行</title> 

	<link href="../css/default/frame_default.css" rel="stylesheet" type="text/css"/>
	<link href="../css/default/table.css" rel="stylesheet" type="text/css"/>
	<link href="../css/default/text.css" rel="stylesheet" type="text/css"/>
	<link href="../css/default/error.css" rel="stylesheet" type="text/css"/>
	<link href="../css/default/hulian.css" rel="stylesheet" type="text/css"/>
	
	<script src="js/lib/jquery-1.7.2.js"></script>
	<script src="js/lily.core.js"></script>
	<script src="js/lily.param.js"></script>
	<script src="js/frontpage/perbank.js"></script> 
	
	<script type="text/javascript">
		function preStep(){
			document.loginForm.action='../login.html';
		    document.loginForm.submit();
		}
	
	</script>
</head>
<body class="hulian_body">
<div style="background: url('../img/login_bg_login.png') repeat;">
<div class="hulian_banner">
	<div class="hulian_logo"></div>
    <div class="hulian_phone">客户服务热线：96599（湖北）、400-85-96599（全国）</div>
</div>
<div class="hulian_bg">
<div class="hulian_area_content">
    <div class="clear"></div>	
	<!-----------------------------------------------------------------req 录入界面---------------------------------------------------------->
    <div class="area_content_tc">
        <div class="success">
    	<div class="success_icon"></div>
        <div class="success_failwzdh">
            <ol>
        		<li class="success_fail">注册成功！</li>
        		<li class="success_fail">您的客户号是：PB2000002454</li>
        		<li class="success_fail">您的账号是：621270002700020128</li>
            </ol>
         </div>
    </div>
	 <div class="menu_dh">
        <div class="menu_dh_left1"></div>
        <div class="menu_dhmc">自助注册结果</div>
    </div>
	<div class="area_button" >
		<button class="button" type="button" onclick='javascript:preStep()'>开始登录</button>
	</div>
</div>
</div>
</div>

<form name="loginForm" method="post" action="signIn.html">
	<input type="hidden" name="logonId" value="" />
	<input type="hidden" name="passwordEncrypted" value="" />
	<input type="hidden" name="checkCode" value="" />
</form>

<div style="border-top:2px solid #971922;width:980px;margin:0px auto;height:2px;"></div>
<div style="height:45px;line-height:45px;color:#00184e;margin:0px auto;text-align:center;">Copyright© 湖北银行 All Rights Reserved.</div>
</div>
</body>

</html>
