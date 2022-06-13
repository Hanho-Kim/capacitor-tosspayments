package glit.capacitor.tosspayments;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONObject;

@NativePlugin(
        requestCodes={TossPaymentsPlugin.REQUEST_CODE}
)
public class TossPaymentsPlugin extends Plugin {
    Intent intent;

    static final int REQUEST_CODE = 6018;
    static final String WEBVIEW_PATH = "file:///android_asset/html/webview_source.html";

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", value);
        call.success(ret);
    }

    @PluginMethod
    public void startTossPaymentsActivity(final PluginCall call) {

        getActivity().runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        intent = new Intent(getContext(), TossPaymentsActivity.class);
                        JSONObject params = call.getData();
                        intent.putExtra("params", params.toString());
                        startActivityForResult(call, intent, REQUEST_CODE);
                    }
                }
                );
    }

    // in order to handle the intents result, you have to @Override handleOnActivityResult
    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);

        // Get the previously saved call
        PluginCall savedCall = getSavedCall();

        if (savedCall == null) {
            return;
        }

        if (requestCode == REQUEST_CODE) {

            Bundle extras = data.getExtras();
            String role = extras.getString("role");
            String url = extras.getString("url");

            if(role.equalsIgnoreCase("fail") || role.equalsIgnoreCase("success")) {
                JSObject ret = new JSObject();
                ret.put("url", url);
                ret.put("role", role);

                notifyListeners("tossPaymentsOnOver", ret);
            }

        }
    }

}
