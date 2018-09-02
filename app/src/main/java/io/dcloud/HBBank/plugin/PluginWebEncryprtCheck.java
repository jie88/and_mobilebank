package io.dcloud.HBBank.plugin;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;

import com.encryprt.WebEncryprtListener;
import com.encryprt.WebEncryprtUtil;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

public class PluginWebEncryprtCheck extends StandardFeature {
	
	private String CallBackID;
	private IWebview bWebview;
	private Activity activity;

	public void getEncryprtString(IWebview iWebview, JSONArray jsonArray){
		activity = iWebview.getActivity();
		bWebview = iWebview;
		try {
			CallBackID = jsonArray.optString(0);
			String serverUrl = jsonArray.optString(1);
		    String serverInterface = jsonArray.optString(2);
	        String encryptData = jsonArray.optString(3);
		
			 WebEncryprtUtil util = new
	                 WebEncryprtUtil(new WebEncryprtListener() {
	                	 @Override
	                     public void onError(byte[] errorMsg) {
	                		 JSUtil.execCallback(bWebview, CallBackID, new String(errorMsg), JSUtil.ERROR, false);
	                     }

	                     @Override
	                     public void onSuccess(byte[] successMsg) {
	                         try {
	                             //在这里进行加密成功后的处理
	                             String jsonStr = new String(successMsg);
								JSONObject responseJson = new JSONObject(jsonStr);
								JSUtil.execCallback(bWebview, CallBackID, responseJson, JSUtil.OK, false);
							} catch (JSONException e) {
								// TODO Auto-generated catch block
								 JSUtil.execCallback(bWebview, CallBackID, e.getMessage()+"获取授权状态失败", JSUtil.ERROR, false);
								e.printStackTrace();
							}

	                     }
	         });
			 util.webEncryprt(serverUrl, serverInterface, encryptData);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			 JSUtil.execCallback(bWebview, CallBackID, e.getMessage()+"获取授权状态失败", JSUtil.ERROR, false);
			e.printStackTrace();
		}

		
		 
         
	}
}
