


<!DOCTYPE html>
<html lang="zh">
<head>
	<META http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>湖北银行个人网上银行</title>
	<link href="css_nor/base.css" rel="stylesheet" type="text/css" />
	<link href="css_nor/login.css" rel="stylesheet" type="text/css" />
	<script src="js_nor/lib/jquery-1.7.2.js"></script>
	<script src="js_nor/lily.core.js"></script>
	<script src="js_nor/lily.displayer.js"></script>
	 <script src="js_nor/lily.window.js"></script>
	 <script src="js_nor/lily.mvc.js"></script>
	<script src="js_nor/frontpage/perbank.js"></script> 
	<script src="js_nor/frontpage/public/perbank.js"></script> 
	<script src="js_nor/lib/PassGuardCtrl.js"></script>
	<script src="js_nor/lily.button.js"></script>
    <script src="js_nor/lily.placeholder.js"></script>
    <script src="js_nor/lily.usbkeyUtil.js"></script>
</head>
<body onload='init();'>
	<!--头部-->
	<div class="login_top_bg">
		<div class="login_top"></div>
	</div>
	<!--头部END-->
	<!--内容-->
	<div class="login_box1">
	    <div class="login_box2">
	    
	          <div class="login_box">
	          <!--选卡-->
	          <div class="login_tab">
	              <ul>
	                  <li class="sel" onclick="changeLogin(this);" value="0"><a>普通版</a></li>
	                  <li onclick="changeLogin(this);" value="1"><a>创新版</a></li>
	              </ul>
	          </div>
	          <table border="0" cellspacing="0" cellpadding="0" width="80%" align="center">
	          	  <tr>
	                <td height="10" colspan="3"></td>
	              </tr>
	              <tr>
	              	<td class="title" >登录名：</td>
	                <td height="40" colspan="2"><input id="logonId" name="logonId" type="text" class="login_input"  size="30" maxLength="30" /></td>
	              </tr>
	              <tr>
	              	<td class="title" >密&nbsp;&nbsp;&nbsp;码：</td>
	                <td height="40" colspan="2" id='PWDTR'></td>
	              </tr>
	              <tr>
	              	<td class="title" >验证码：</td>
	                <td height="40">
	                	<input type="text" class="login_input" id="checkCode" name="checkCode" maxlength="4"  size="15" style="ime-mode: disabled;width: 80px;"  onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\x00-\xff]/g,''))" />
	                </td>
	                <td height="40" >
	                    <img  id="verifyImg" src="VerifyImage" align="absmiddle" onclick="changeImage()" style="cursor:pointer;" title="点击图片可刷新验证码"/>
	                </td>
	              </tr>
	              <tr>
	              	<td class="title" ></td>
	                <td height="30" colspan="2">
						<a href="javascript:register();">自助注册</a>
					</td>
	              </tr>
	              <tr>
	                <td height="50" align="center" colspan="3">
	                    <a href="#" id="login-submit-btn" onclick="doSubmit()"><img src="../images/login_btn.png" /></a>
	                </td>
	              </tr>
	          </table>
	          </div>
	    
	    </div>
	<div class="h20"></div>
	<div class="login_btn">
	      <div class="login_ico">
	          <li><a href="#"  id="demo-tip" class="ico1" onclick="goToDemo();">模拟演示</a></li>
	          <li><a href="#"  id="help-tip" class="ico2" onclick="goToChangJian();">常见问题</a></li>
<!-- 	          <li><a href="#"  id="help-tip" class="ico2" onclick="showRelative();">相关下载</a></li> -->
	          <li><a href="#"  id="security-tip" class="ico3" onclick="showSecurity();">安全提示</a></li>          
	      </div>
	      <!--foot-->
	      <div class="footer_login" id="security-comment">
	          <li>为获得最佳体验，建议使用IE9或IE8浏览器登录网上银行。</li>
			  <li>请使用<a href="download/dyccb_ebank_helper.zip"><font style="color: red;font-size: 14px;">"网银助手"</font></a>或在<a href="#" ><font style="color: red;font-size: 14px;">"相关下载"</font></a>中更新USBKEY驱动和控件以保证正常使用网银。</li>
	          <li>请登录正确的网上银行网址，请尽量避免在网吧等公共场所使用网上银行。</li>
	          <li>请不要在任何时候及情况下，将您的账号、密码告诉他人。</li>
	          <li>使用完毕后，请安全退出网上银行，关闭浏览器，并将USBKEY拔出。</li>
	      </div>
	      <div class="footer_login" id="demo-comment" style="display: none;">
	          <table  border="0" style="margin-left:15px;width: 400px;cursor: pointer;" onclick="goToDemo();">
						<tr>
							<td width="50px"><img src="img/demo_pic.png"/></td>
							<td width="300px">
								<div style="color:#267cb5;font-size: 18px;font-weight: bold;margin-top: 1px;" >模拟演示</div>
									<ul><li class="hightLight">点击进入湖北银行个人网银演示版</li>
										<li class="hightLight">使用演示版您能体验到真实完整的操作流程</li>
										<li class="hightLight">演示版中所有数据信息都是虚拟的，与客户无关</li>
									</ul>
							</td>
						</tr>
					</table>
	      </div>
	      <div class="footer_login" id="relative-comment"  style="display: none;">
	          <table  border="0" style="margin-left:15px;width: 400px;cursor: pointer;" onclick="goToRelative();">
					<tr>
						<td width="50px"><img src="img/down_pic.png"/></td>
						<td width="400px">
							<div style="color:#267cb5;font-size: 18px;font-weight: bold;margin-top: 1px;" >相关下载</div>
								<ul>
									<li class="hightLight">点击进入湖北银行个人网银相关下载页面</li>
									<li class="hightLight">第一次登录网银，请安装我行提供的相关软件</li>
									<li class="hightLight">为确保安装成功，请您在安装期间暂时关闭杀毒软件</li>
									<li class="hightLight">建议您在安装完成后重启电脑</li>
								</ul>
						</td>
					</tr>
				</table>
	      </div>
	      <!--foot END-->
	      
	</div>
	</div>
	<!--内容END-->
	
	<form name="loginForm" method="post" action="signIn.html">
		<input type="hidden" name="logonId" value="" />
		<input type="hidden" name="passwordEncrypted" value="" />
		<input type="hidden" name="checkCode" value="" />
		<input type="hidden" name="ebankVersion" id="ebankVersion" />
	</form>
	<form name="loginForm2" method="post" action="">
	</form>
	<script type="text/javascript">
	var pgeditor=null;
		function init(){
// 			Get_IE_Version();
			
			$(document).keypress(function(event){ 
				if(event.keyCode==13){
					doSubmit();
				} 
			}); 
			setInputMsg('logonId','身份证号/账号/用户名/客户号');
			clearInfo();
			initPgeditor();
		}
		
		function initPgeditor(){
// 			$.SignDataVersion();
			pgeditor = $("#PWDTR").pgeditor(2, 6, 20, 0, "ocx_style");
		}
	    function changeImage(){
	    	document.getElementById("verifyImg").src = 'VerifyImage?update=' + Math.random();
	    }
	
	    function clearInfo(){
	    	$('#logonId').val('身份证号/账号/用户名/客户号');
	    	$('#passwordEncrypted').val('');
	    	$('#checkCode').val('');
	    }
	    function Get_IE_Version()
	    {
	    	var v;
			if(navigator.userAgent.indexOf("MSIE 7.0")>0)
	    	{
	    	  v=7;
	    	}
	    	else if(navigator.userAgent.indexOf("MSIE 8.0")>0)
	    	{
	    	   v=8;
	    	} else if(navigator.userAgent.indexOf("MSIE 9.0")>0)
	    	{
	    	  v=9;
	    	}else{
	    		v=10;
	    	}
	    	if(v>9){
	    		window.location.href = "browser.html";
	    	}
	    } 
	    function doSubmit() {
	    	var logonId = $('#logonId').val();
	    	if(logonId=='身份证号/账号/用户名/客户号'){
	    		logonId='';
	    	}
	    	var passwordEncrypted = $('#passwordEncrypted').val();
	    	var checkCode = $('#checkCode').val();
	    	if(isEmpty(logonId)){
		    	alert('登录名不能为空');
		    	return;
	    	}
	    	if(pgeditor.pwdLength() == 0){
		    	alert('登录密码不能为空');
		    	return;
	    	}
	    	if (pgeditor.pwdValid() == 1) {
	    		alert("登录密码必须为6-20位的数字和字母的组合");
	    		return;
	    	}
	    	var passwordEncrypted = "";
// 	    	var key = $.perbank.getKey();
// 			pgeditor.pwdSetSk(key);
		    passwordEncrypted = pgeditor.pwdResult38();
	    	if(isEmpty(checkCode)){
		    	alert('验证码不能为空');
		    	return;
	    	}
	    	if(checkCode.length<4){
		    	alert('验证码为4位字符');
		    	return;
	    	}
	    	document.loginForm.logonId.value = logonId;
	    	$("#ebankVersion").val($(".sel").attr('value'));//0 大众版  1 创新版
	    	document.loginForm.passwordEncrypted.value = passwordEncrypted;
	    	document.loginForm.checkCode.value = checkCode;
	    	nosessionAjax({
	    		url:'checkImageCode.html',
	    		data:{'checkCode':checkCode},
	    		success:function(data){
	    			if('0'==data.state){
	    				document.loginForm.submit();
	    				$('#login-submit-btn').attr('disabled',true);
	    			}else{
	    				if('1'==data.state){
		    				alert('验证码已失效，请重新输入');
		    				changeImage();
		    				//initPgeditor();
	    				}else{
	    					alert('验证码错误，请重新输入');
	    					changeImage();
	    				}
	    				 $('#checkCode').val('')
	    		    }
	    		}
	    	});
	    }
	
	    function register(){
		    document.loginForm.action='./register_agreement.html';
		    document.loginForm.submit();
	    }
	
	    function showSecurity(){
	    	document.getElementById("security-comment").style.display='';
	    	document.getElementById("demo-comment").style.display='none';
	    	document.getElementById("relative-comment").style.display='none';
	    	document.loginForm2.action='cb_safeInfo.html';
	    	document.loginForm2.submit();
	    }
	
	    function showDemo(){
	    	document.getElementById("security-comment").style.display='none';
	    	document.getElementById("demo-comment").style.display='';
	    	document.getElementById("relative-comment").style.display='none';
	    }

	    function showRelative(){
	    	document.getElementById("security-comment").style.display='none';
	    	document.getElementById("demo-comment").style.display='none';
	    	document.getElementById("relative-comment").style.display='';
	    }
	
	    function goToDemo(){
	    	 alert("您即将进入湖北银行个人网银模拟演示");
	    	 document.loginForm2.target="_blank";
	    	 document.loginForm2.action='./login.html';
			 document.loginForm2.submit();
	    }
	    function goToRelative(){
	    	 document.loginForm2.target="_blank";
	    	 document.loginForm2.action='weightDownloadPage.htm';
			 document.loginForm2.submit();
	    }
	    function goToChangJian(){
	    	document.loginForm2.target="_blank";
	    	document.loginForm2.action='changJian.htm';
	    	document.loginForm2.submit();
	    }
	    
	    function changeLogin(obj){
	    	var isChange = obj.className;
	    	if(isChange==''){
	    		$('.sel').removeClass();
	    		obj.className = 'sel';
	    	}
	    }
	</script>
<!--     <div style="display:none"> -->
<!-- 		<object id="signx" height="0" width="0" classid="CLSID:79275600-B1B2-48DD-9FF5-8F8956145FF1" codebase="ocx/koalii_svs_acx.CAB#version=2,1,0,2" VIEWASTEXT></object> -->
<!-- 	</div> -->
	<!-- <div style="display:none">
		<object id="oldEzSignCtl" classid="CLSID:46C37CA9-D85D-4BFC-B758-992A897D7435" codebase="ocx/DYCCBCtrl.cab#version=1,0,2,0" height=0 width=0 VIEWASTEXT></object>
	</div> -->
</body>
</html>
