
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<META http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>湖北银行个人网上银行</title>
	
	<link href="../css/default/frame_default.css" rel="stylesheet" type="text/css"/>
	<link href="../css/default/table.css" rel="stylesheet" type="text/css"/>
	<link href="../css/default/text.css" rel="stylesheet" type="text/css"/>
	<link href="../css/default/error.css" rel="stylesheet" type="text/css"/>
	<link href="../css/default/hulian.css" rel="stylesheet" type="text/css"/>
	<link href="../css/login.css" rel="stylesheet">
	
	<script src="../js/lib/jquery-1.7.2.js"></script>
	<script src="../js/lily.core.js"></script>
	<script src="../js/lily.param.js"></script>
<!-- 	<script src="../js/lily.window.js"></script> -->
	<script src="../js/lily.format.js"></script>
	<script src="../js/lily.validator.js"></script>
	<script src="../js/frontpage/perbank.js"></script> 
	<script type="text/javascript" src="../js/lib/PassGuardCtrl.js"></script>
	<script src="../js/KeyCodeControl.js"></script>
	<script src="../js/lily.validator.js"></script>
	<script src="../js/frontpage/public/perbank.js"></script>
	
	<script type="text/javascript">
		function preStep(){
			document.loginForm.action='register_agreement.html';
		    document.loginForm.submit();
		    
		}
		function nextStep(){
			if(!checkForm())
				return;
			
// 			if(pgeditor1.pwdLength() == 0){
// 		    	alert('取款密码不能为空');
// 		    	return;
// 	    	}
// 	    	if (pgeditor1.pwdValid() == 1) {
// 	    		alert("取款密码为6位数字");
// 	    		return;
// 	    	}
// 	    	 var key = $.perbank.getKey();
// 			pgeditor1.pwdSetSk(key);
// 			pgeditor2.pwdSetSk(key);
// 			pgeditor3.pwdSetSk(key);
// 	    	$('#accountPassword').val(pgeditor1.pwdResult39());


// 			if(pgeditor2.pwdLength() == 0){
// 		    	alert('登录密码不能为空');
// 		    	return;
// 	    	}
// 	    	if (pgeditor2.pwdValid() == 1) {
// 	    		alert("登录密码为6-20位字符，必须包含字母和数字");
// 	    		return;
// 	    	}
// 	    	$('#password').val(pgeditor2.pwdResult38());

// 			if(pgeditor3.pwdLength() == 0){
// 		    	alert('确认登录密码不能为空');
// 		    	return;
// 	    	}
// 	    	if (pgeditor3.pwdValid() == 1) {
// 	    		alert("确认登录密码为6-20位字符，必须包含字母和数字");
// 	    		return;
// 	    	}
// 	    	$('#confirmPassword').val(pgeditor3.pwdResult38());

	    	
// 			if($('#password').val() != $('#confirmPassword').val()){
// 				alert('两次输入的登录密码不一致');
// 				return;
// 			}
			
			
			document.register.action='./regist.html';
		    document.register.submit();
		}
		
		function checkForm(){
			return checkInputReg([
				{input:$('#certNo'),reg:REG_UNEMPTY},
				{input:$('#accountNo'),reg:REG_UNEMPTY},
				{input:$('#userName'),reg:REG_UNEMPTY}
// 				{input:$('#checkCode'),reg:REG_UNEMPTY}
			]);
		}

		function errorMsg(msg){
			alert(msg);
		}
	
		 function sendCode(){
			var mobile=$('#mobileNo').val();
			if(isEmpty($('#accountNo').val()) || isEmpty($('#userName').val())){
				alert('请填写注册账户和户名');
				return;
			}
// 			var imageCode=$('#checkCodeImage').val();
// 			if(isEmpty(imageCode)){
// 				$('#image_div').show();
// 				setInputError($('#checkCodeImage'),'请输入图形验证码');
// 				return;
// 			}else{
// 				clearInputError($('#checkCodeImage'));
// 			}
			if($.lily.format.isMobile(mobile)==false){
				alert('请填写正确的手机号');
				return;
			}
			$('#checkCodeImage').val('')
			$('#image_div').hide();
			nosessionAjax({
				url:'sendMobieCode.html',
				data:{'mobileNo':mobile,accountNo:$('#accountNo').val(),userName:$('#userName').val(),serviceCode:'1'},
				success:function(data){
					if(data.ec!='000'){
						alert(data.em);
						$('#sendCodeId').show();
						$('#successMsgId').hide();
						$('#errorMsgId').show();
						$('#image_div').show();
						changeImage();
						return;
					}
					if('0'==data.smsSendResult){
						$('#sendCodeId').hide();
						$('#successMsgId').show();
						$('#errorMsgId').hide();
						initTimer();
					}else{
						$('#sendCodeId').show();
						$('#successMsgId').hide();
						$('#errorMsgId').show();
						$('#image_div').show();
						changeImage();
				    }
				}
			});
		 	
		 }
	
		 var leftTimeVal=0;
		 var timerVal=null;
		 function initTimer(){
			 leftTimeVal=99;
			 timerVal=window.setInterval("showTime()", 1000)
		 }
		 function showTime(){
			 $('#leftTimeId').text(leftTimeVal--);
			 if(-1==leftTimeVal){
			 	window.clearInterval(timerVal)
			 	$('#successMsgId').hide();
				$('#sendCodeId').show();
				$('#image_div').show();
				changeImage();
			 }
		 }

		 var passStrength=null;
		 function initStrengthTimer(){
			window.setInterval("showStrength()", 40000);
		 }
		 function showStrength(){
			 if(null==pgeditor2|| null==passStrength){
				 return;
			 }
			 var level=pgeditor2.pwdStrength();
			 level--;
			 passStrength.updateContrl(level);
		 }
		 
		 var regAccountPassword=new RegExp(/^\d{6}$/);
		 var pgeditor1=null;
		 var pgeditor2=null;
		 var pgeditor3=null;
		 function init(){
			 
			 initStrengthTimer();
			 
			 initPgeditor();
			 
// 			 var pgeditors=registerPgeditor([accountPassConfig("accountPasswordTD"),loginPassConfig("passwordTD"),loginPassConfig("confirmPasswordTD")]);
// 			 pgeditorAccountPassword=pgeditors[0];
// 			 pgeditorPassword=pgeditors[1];
// 			 pgeditorConfirmPassword=pgeditors[2];
			 $('#certType').append($($.lily.param.getSelect('CERT_TYPE',null,null,false)));
			 setInputReg($('#certNo'),REG_UNEMPTY);
			 setInputReg($('#accountNo'),REG_UNEMPTY);
			 setInputReg($('#userName'),REG_UNEMPTY);
// 			 setInputReg($('#checkCode'),REG_UNEMPTY);
// 			 $('#checkCode').val('');
		 }
		 
		 
		 function initPgeditor(){
// 			 var keys = $.perbank.getKey();
// 			 pgeditor1 = $("#accountPasswordTD").pgeditor(1, 6, 6, 0, "ocx_style",keys);
// 			 pgeditor2 = $("#passwordTD").pgeditor(1, 6, 20, 0, "ocx_style",keys);
// 			 pgeditor3 = $("#confirmPasswordTD").pgeditor(1, 6, 20, 0, "ocx_style",keys);
			 
			 
			 
				
				
		 }
		 
		
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 
		 

		 function regInputMsg(item){
			if(null==item || null==item.rule || isEmpty(item.id)){
				return;
			}	
			var input=nulll;
			if(null==item.context){
				input=$('#'+item.id);
			}else{
				input=$('#'+item.id,item.context);
			}
			input.bind('focus',function(){
				if(isEmpty(item.msg)){
					return;
				}
				var lastTD=$(this).parent().parent().children("td").last();
				lastTD.empty();
				lastTD.append($('<div class="tishi_on" style="" align="left">'+item.msg+'</div>'));
			 });
			 input.bind('blur',function(){
				 if(isEmpty(item.msgError)){
				 	return;
				 }
				 var lastTD=$(this).parent().parent().children("td").last();
				 lastTD.empty();
				 var result=item.rule.test($.trim($(this).val()));
				 if(true==result){
					 if(!isEmpty(item.msg)){
					 	lastTD.append($('<div class="tishi_on" style="" align="left">'+item.msg+'</div>'));
					 }
				 }else{
					 lastTD.append($('<div class="tishi_err" style="" align="left">'+item.msgError+'</div>'));
				 }
			 });
		 }

		 function setInputReg(input,reg,errorMsg){
			 if(null==input){
				 return;
			 }
			 input.bind('focus',function(){
				 var lastTD=$(this).parent().parent().children("td").last();
				 var info=lastTD.find('.tishi_on');
				 if(0==info.length){
					 return;
				 }
				 lastTD.find('.tishi_err').hide();
				 info.show();
			 });
			 input.bind('blur',function(){
				 var lastTD=$(this).parent().parent().children("td").last();
				 var info=lastTD.find('.tishi_on');
				 var result=reg.test($.trim($(this).val()));
				 if(true==result){
					 lastTD.find('.tishi_err').hide();
					 lastTD.find('.tishi_on').show();
				 }else{
					 lastTD.find('.tishi_on').hide();
					 if(!isEmpty(errorMsg)){
						 lastTD.find('.tishi_err').text(errorMsg);
					 }
					 lastTD.find('.tishi_err').show();
				 }
			 });
		}

		  function changeImage(){
		    	document.getElementById("verifyImg").src = 'VerifyImage?update=' + Math.random();
		    }
		  
		  function reset111()
		  {
			  $('#certNo').val('');
			  $('#accountNo').val('');
			  $('#userName').val('');
			  pgeditor1.pwdclear();
			  pgeditor2.pwdclear();
			  pgeditor3.pwdclear();
			  $('#mobileNo').val('');
// 			  $('#checkCode').val('');
		  }
		  
		  function showInfo(obj)
		  {
			  var ct = $('#certType').val();
			  var isCard = new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$/);
			  if(ct=='0'){
				  if(!isCard.test(obj)){ 
					  setInputError($('#certNo'),'请输入合法的身份证');				  
				  }  else{
					  clearInputError($('#certNo'));
				  }
			  }else{
					  clearInputError($('#certNo'));
			  }
			  
				  
		  }
		  
		  function showInfo1(obj)
		  {
				  clearInputError($('#userName'));
			  var an = $('#userName').val();
			  
			  var isChinaName = /^[\u4E00-\u9FFF]+$/;
			  var isAccName = /^([a-zA-Z ]+|[\u4e00-\u9fa5]+)$/;
// 			  var isAccName = new RegExp(/^[\u4E00-\u9FA5A-Za-z_]+$/);
			  if(!isAccName.test(obj)){
				  setInputError($('#userName'),'户名应为中文或者英文');
			  }else if(isChinaName.test(obj)){
				  if(an.length<2){
				  	setInputError($('#userName'),'户名的长度为2位以上');
				  }
			  }else{
				  clearInputError($('#userName'));
			  }
		  }

	</script>
</head>

<body  class="hulian_body" onload="init();">
<div style="background: url('../img/login_bg_login.png') repeat;">
<div class="hulian_banner">
	<div class="hulian_logo"></div>
    <div class="hulian_phone"><strong id="telNum">客户服务热线：96599（湖北）、400-85-96599（全国）</strong></div>
</div>
<div class="hulian_bg">
	<div class="hulian_area_content">
	    <!--页码区域-->
	    <div class="clear"></div>	
		<!-----------------------------------------------------------------req 录入界面---------------------------------------------------------->
	    <div class="area_content_tc">
	    <div class="menu_dh">
	        <div class="menu_dh_left1"></div>
	        <div class="menu_dhmc">自助注册信息录入</div>
	    </div>
	   <form name="register" method="post" action="register.html">	
	    <table width="99%" border="0" cellpadding="0" cellspacing="0" class="zhuanzhang_table_border" >
	    	<col width="35%" />
	     	<col width="35%" />
	      	<col width="30*" />
			<tr>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>证件类型：</font></td>
				<td  align="left" class="text_content hs_color" >
					<select id="certType" class="text_input2" name="certType">
					<option value="0" selected >二代身份证</option>
					<option value="1">军官证</option>
					<option value="2">解放军文职干部证</option>
					<option value="3">警官证</option>
					<option value="4">解放军士兵证</option>
					<option value="5">户口簿</option>
					<option value="6">(港、澳)回乡证、通行证、</option>
					<option value="7">（台）通行证、其他有效旅行证</option>
					<option value="8">（外国）护照</option>
					<option value="9">（中国）护照</option>
					<option value="A">武警士兵证</option>
					<option value="B">军事院校学员证</option>
					<option value="C">军官退休证</option>
					<option value="D">文职干部退休证</option>
					<option value="E">离退休干部荣誉证</option>
					<option value="F">其他</option>
					</select>
				</td>
				<td  align="left" class="text_content hs_color"></td>
			</tr>
			
			<tr>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>证件号码：</font></td>
				<td  align="left" class="text_content hs_color" >
					<input id='certNo' name='certNo'  maxlength="30" class="text_input2" value="420202200301111221" onblur="showInfo(this.value);"/>
				</td>
				<td  align="left" class="text_content hs_color">
					<div class="tishi_err" style="display: none;" id="ct_err">证件号码不能为空</div>
				</td>
			</tr>
			
			<tr>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>账号：</font></td>
				<td  align="left" class="text_content hs_color" >
					<input id='accountNo' name='accountNo'  class="text_input2"  maxlength="32" value="621270002700020128" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
				</td>
				<td  align="left" class="text_content hs_color" >
					<div class="tishi_err" style="display: none;">账号不能为空</div>
				</td>
			</tr>
			
			<tr>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>户名：</font></td>
				<td  align="left" class="text_content hs_color" >
<!-- 					<input id='userName' name='userName'  class="text_input2" onblur="showInfo1(this.value);"  maxlength="15"/> -->
					<input id='userName' name='userName'  class="text_input2" value="张三"  maxlength="15"/>
				</td>
				<td  align="left" class="text_content hs_color" >
					<div class="tishi_err" style="display: none;">户名不能为空</div>
				</td>
			</tr>
			
			<tr>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>卡密码：</font></td>
				<td  align="left" class="text_content hs_color" >
				<input id="password" name="password" type="password" class="text_input2" value="111111"  maxLength="15"  />
				</td>
				
				<td  align="left" class="text_content hs_color" >
					<div class="tishi_on" style="" align="left">取款密码为6位数字</div>
				</td>
			</tr>
			
			<tr>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>设置登录密码：</font></td>
				<td  align="left" class="text_content hs_color" >
				<input id="passwordLogin" name="passwordLogin" type="password" class="text_input2" value="111111"  maxLength="15"  />
				</td>
				<td  align="left" class="text_content hs_color" >
					<div class="tishi_on" style="" align="left">登录密码为6-20位字符，必须包含字母和数字</div>
				</td>
			</tr>
			
			<tr>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>确认登录密码：</font></td>
				<td  align="left" class="text_content hs_color" >
				<input id="rePasswordLogin" name="rePasswordLogin" type="password" class="text_input2"  value="222222" maxLength="15"  />
				</td>
				<td  align="left" class="text_content hs_color" >
					<div class="tishi_on" style="" align="left">登录密码为6-20位字符，必须包含字母和数字</div>
				</td>
			</tr>
			<tr>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>登录密码強度：</font></td>
				<td class="text_content hs_color" align="left">
					<table style="width: 133px; height: 21px;" id="pwd_div_89874_table" cellSpacing="0" cellPadding="0"><tbody><tr><td style="border-right-color: rgb(233, 174, 16); border-bottom-color: rgb(233, 174, 16); border-left-color: rgb(255, 255, 255); border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; background-color: rgb(255, 211, 94);" id="pwd_div_89874_td_0" width="33%" align="center"><span style="font-size: 1px;">&nbsp;</span><span style="padding: 2px; color: rgb(0, 0, 0); font-size: 12px; display: none;" id="pwd_div_89874_label_0">弱</span></td><td style="border-right-color: rgb(233, 174, 16); border-bottom-color: rgb(233, 174, 16); border-left-color: rgb(255, 255, 255); border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; background-color: rgb(255, 211, 94);" id="pwd_div_89874_td_1" width="33%" align="center"><span style="font-size: 1px;">&nbsp;</span><span style="padding: 2px; color: rgb(0, 0, 0); font-size: 12px; display: inline;" id="pwd_div_89874_label_1">中</span></td><td style="border-right-color: rgb(190, 190, 190); border-bottom-color: rgb(190, 190, 190); border-left-color: rgb(255, 255, 255); border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; background-color: rgb(235, 235, 235);" id="pwd_div_89874_td_2" width="33%" align="center"><span style="font-size: 1px;">&nbsp;</span><span style="padding: 2px; color: rgb(0, 0, 0); font-size: 12px; display: none;" id="pwd_div_89874_label_2">强</span></td></tr></tbody></table>
				</td>
				<td  align="left" class="text_content hs_color" ></td>
			</tr>
			<!--  图形验证码需求没有
			<tr id='image_div' style='display:;'>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>图形验证码：</font></td>
				<td  align="left" class="text_content hs_color" >
					&nbsp;<input id="checkCodeImage" name="checkCodeImage" type="text" value="" class="checkCodeInput" maxlength="4" style="ime-mode: disabled;color:gray;width: 80px;"  onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\x00-\xff]/g,''))" tabindex="3"/>
					<img  id="verifyImg" src="VerifyImage" align="absmiddle" onclick="changeImage()" style="cursor:pointer;" title="点击图片可刷新验证码"/>
				</td>
				<td  align="left" class="text_content hs_color" ></td>
			</tr>
			-->
			<tr>
				<td align='right' class="text_content text_right td_bg1"><font color='red'>&nbsp;</font><font color='black'>手机号：</font></td>
				<td  align="left" class="text_content hs_color" >
					<input id='mobileNo' name='mobileNo'  class="text_input2" value="13800000000"  maxlength="11"/>
				</td>
				<td  align="left" class="text_content hs_color">
					<div class="tishi_err" style="display: none;">电话号码不能玩为空！</div>
				</td>
				
				
<!-- 				<td  align="left" class="text_content hs_color" style="display:none;"> -->
<!-- 					<a href='javascript:sendCode()' id='sendCodeId'>发送手机验证码</a> -->
<!-- 					<span id='successMsgId' style="display: none;"> -->
<!-- 						手机验证码已发送，您可以在<span id='leftTimeId' style='color:red'></span>秒后重新发送 -->
<!-- 					</span> -->
<!-- 					<span id='errorMsgId' style="display: none;color:red;"> -->
<!-- 						发送失败，请重新发送 -->
<!-- 					</span> -->
<!-- 				</td> -->
			</tr>
			
			<tr style="display:none;">
				<td align='right' class="text_content text_right td_bg1"><font color='red'>*&nbsp;</font><font color='black'>手机验证码：</font></td>
				<td  align="left" class="text_content hs_color" >
					<input id='checkCode' name='checkCode'  class="text_input2"  value="aaaa"  maxlength="6"/>
				</td>
				<td  align="left" class="text_content hs_color" >
					<div class="tishi_on" style="" align="left">请输短信验证码(1分钟之内只能获取1次)</div>
					<div class="tishi_err" style="display: none;">手机验证码不能为空</div>
				</td>
			</tr>
		</table>
		<div class="area_button">
			<button class="button" type="button" onclick='nextStep()'>确认</button>
			<button class="button" type="button" onclick='reset111()'>重置</button>
			<button class="button" type="button" onclick='preStep()'>返回</button>
		</div>
	</div>
</div>
</div>
	<input type="hidden" name="logonId" value="" />
	<input type="hidden" id="accountPassword" name="accountPassword" value="" />
	<input type="hidden" id="password" name="password" value="" />
	<input type="hidden" id="confirmPassword" name="confirmPassword" value="" />
	<input type="hidden" name="passwordEncrypted" value="" />
	<input type="hidden" name="gatewayRequest" value="true" />
</form>

<form name="loginForm"></form>
<div style="margin-top:10px">
<div style="border-top:2px solid #971922;width:980px;margin:0px auto;height:2px;"></div>
<div style="height:45px;line-height:45px;color:#00184e;margin:0px auto;text-align:center;">Copyright© 湖北银行 All Rights Reserved.</div>
</div>
</div>
</body>
</html>
