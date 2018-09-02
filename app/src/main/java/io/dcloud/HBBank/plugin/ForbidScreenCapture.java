package io.dcloud.HBBank.plugin;

import android.app.Activity;
import android.view.WindowManager;

import org.json.JSONArray;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

/**
 * Created by wutw on 2018/6/27 0027.
 */
public class ForbidScreenCapture extends StandardFeature {

    IWebview pWebview;
    String CallBackID;

    /**
     * 禁止截屏
    * */
    public void forBidScreenCap(IWebview pWebview, JSONArray array){
        this.pWebview = pWebview;
        this.CallBackID =  array.optString(0);

        final Activity activity = pWebview.getActivity();
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);

            }
        });

        JSUtil.execCallback(pWebview, CallBackID, "Forbid screen capture.", JSUtil.OK, false);
    }

}
