package glit.capacitor.tosspayments;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;

import glit.capacitor.tosspayments.capacitortosspayments.R;

public class TossPaymentsActivity extends Activity {
    WebView webview;
    TossPaymentsWebViewClient webViewClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Application application = getApplication();
        String packageName = application.getPackageName();

        Integer identifier = application.getResources().getIdentifier("toss_payments_activity", "layout", packageName);
        setContentView(identifier);

        webview = (WebView) findViewById(R.id.webview);
        WebSettings settings = webview.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webview, true);

        webview.loadUrl(TossPaymentsPlugin.WEBVIEW_PATH);
        webview.setWebChromeClient(new TossPaymentsWebChromeClient());

        Bundle extras = getIntent().getExtras();
        String params = extras.getString("params");
        webViewClient = new TossPaymentsWebViewClient(this, params);
        webview.setWebViewClient(webViewClient);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        webview.clearHistory();
        webview.clearCache(true);
        webview.destroy();
        webview = null;
    }

    @Override
    public void onBackPressed() {
        if (webview.canGoBack()) {
            webview.goBack();
        } else {
            // Finishing the Activity
            Intent data = new Intent();
            data.putExtra("url", "");
            data.putExtra("role", "fail");
            data.putExtra("onBackPressed", true);

            setResult(TossPaymentsPlugin.REQUEST_CODE, data);
            finish();
        }
    }

}
