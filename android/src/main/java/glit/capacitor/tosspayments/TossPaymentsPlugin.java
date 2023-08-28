package glit.capacitor.tosspayments;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

@CapacitorPlugin(name = "TossPaymentsCapacitor")
public class TossPaymentsPlugin extends Plugin {
    Intent intent;

    static final int REQUEST_CODE = 6018;
    static final int RESULT_CODE_FOR_BACK = 4783;
    static final String WEBVIEW_PATH = "file:///android_asset/html/nf_toss_webview_source.html";

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", value);
        call.resolve(ret);
    }

    @PluginMethod
    public void startTossPaymentsActivity(final PluginCall call) {
        getActivity()
                .runOnUiThread(
                        new Runnable() {
                            @Override
                            public void run() {
                                intent = new Intent(getContext(), TossPaymentsActivity.class);
                                String type = call.getString("type");
                                JSONObject params = call.getData();
                                intent.putExtra("type", type);
                                intent.putExtra("params", params.toString());
                                startActivityForResult(call, intent, "payResult");
                            }
                        }
                );
    }
    @ActivityCallback
    private void payResult(PluginCall call, ActivityResult result) {
        int resultCode = result.getResultCode();
        Log.d("log", "payResult:" + resultCode);
        Intent data = result.getData();

        Bundle extras = data.getExtras();
        String url = extras.getString("url");
        String role = extras.getString("role");
        if (resultCode == RESULT_CODE_FOR_BACK) {
            // 뒤로가기 버튼 눌렀을때
            JSObject ret = new JSObject();
            ret.put("url", url);
            ret.put("role", role);
            notifyListeners("tossPaymentsOnOver", ret);
        } else {
            // 정상적으로 결제 프로세스 종료됐을때


            JSObject ret = new JSObject();
            ret.put("url", url);
            ret.put("role", role);
            notifyListeners("tossPaymentsOnOver", ret);

            //plugin
            call.resolve(ret);
        }
    }

}
