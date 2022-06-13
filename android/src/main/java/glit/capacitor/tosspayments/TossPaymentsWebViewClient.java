package glit.capacitor.tosspayments;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.net.URISyntaxException;

public class TossPaymentsWebViewClient extends WebViewClient {
    Activity activity;
    WebView webView;

    protected String clientKey;
    protected String method;
    protected JSONObject requestParams;

    protected final static String BANKPAY = "kftc-bankpay";
    private final static String ISP = "ispmobile";
    private final static String KB_BANKPAY = "kb-bankpay";
    private final static String NH_BANKPAY = "nhb-bankpay";
    private final static String MG_BANKPAY = "mg-bankpay";
    private final static String KN_BANKPAY = "kn-bankpay";

    private final static String PACKAGE_ISP = "kvp.jjy.MispAndroid320";
    private final static String PACKAGE_BANKPAY = "com.kftc.bankpay.android";
    private final static String PACKAGE_KB_BANKPAY = "com.kbstar.liivbank";
    private final static String PACKAGE_NH_BANKPAY = "com.nh.cashcardapp";
    private final static String PACKAGE_MG_BANKPAY = "kr.co.kfcc.mobilebank";
    private final static String PACKAGE_KN_BANKPAY = "com.knb.psb";


    protected Boolean loadingFinished = false;

    protected final static String MARKET_PREFIX = "market://details?id=";

    public TossPaymentsWebViewClient(Activity activity, String params) {
        this.activity = activity;

        try {
            JSONObject call = new JSONObject(params);

            clientKey = call.getString("clientKey");
            method = call.getString("method");
            requestParams = call.getJSONObject("requestParams");

        } catch (Exception e) {

        }
    }

    /* LIFECYCLE: When url has been changed => true to stop and control / false to keep webview to load the url */
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        this.webView = view;

        String urlRole = pipeUrlRole(url);
        if(urlRole.equalsIgnoreCase("success") || urlRole.equalsIgnoreCase("fail")){ // => Finish Activity & Close modal
            Intent data = new Intent();
            data.putExtra("role", urlRole);
            data.putExtra("url", url);

            activity.setResult(TossPaymentsPlugin.REQUEST_CODE, data);
            activity.finish();

            return true;
        }else if(urlRole.equalsIgnoreCase("https")){ // => Normal HTTP request case
            return false;
        }

        Intent intent = null;
        try { // Run 3rd party package
            intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME); // Intent URI 처리
            if (intent == null) return false;

            startNewActivity(intent.getDataString());
            return true;
        } catch(URISyntaxException e) { // Error
            return false;
        } catch(ActivityNotFoundException e) { // PG사에서 호출하는 url에 package 정보가 없는 경우 => Call Playstore market
//            String scheme = intent.getScheme();
//            if (isSchemeNotFound(scheme)) return true;

            String packageName = intent.getPackage();
            if (packageName == null) return false;

            startNewActivity(MARKET_PREFIX + packageName);
            return true;
        }
    }

    /* LIFECYCLE: After page has been loaded */
    public void onPageFinished(WebView view, String url){
        if (!loadingFinished && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {

            view.evaluateJavascript("var tossPayments = TossPayments('" + clientKey + "');", null);
            view.evaluateJavascript("tossPayments.requestPayment('" + method + "'," + requestParams + ");", null);

            loadingFinished = true;
        }
    }

    protected String pipeUrlRole(String url){
        if(url.startsWith("http://toss-payments-after-success-url")){
            return "success";
        }else if(url.startsWith("http://toss-payments-after-fail-url")){
            return "fail";
        }else if(url.startsWith("https://") || url.startsWith("http://") || url.startsWith("javascript:")){
            return "https";
        }

        return "unknown";
    }

    protected void startNewActivity(String parsingUri) {
        try{
            Uri uri = Uri.parse(parsingUri);
            Intent newIntent = new Intent(Intent.ACTION_VIEW, uri);

            activity.startActivity(newIntent);
        } catch(Exception e){  // Incase of simulator, since playstore is not installed that the trial will be rejected

        }
    }

    /* ActivityNotFoundException에서 market 실행여부 확인 */
    public boolean isSchemeNotFound(String scheme) {
        if (ISP.equalsIgnoreCase(scheme)) {
            startNewActivity(MARKET_PREFIX + PACKAGE_ISP);
            return true;
        }
        if (BANKPAY.equalsIgnoreCase(scheme)) {
            startNewActivity(MARKET_PREFIX + PACKAGE_BANKPAY);
            return true;
        }
        if (KB_BANKPAY.equalsIgnoreCase(scheme)) {
            startNewActivity(MARKET_PREFIX + PACKAGE_KB_BANKPAY);
            return true;
        }
        if (NH_BANKPAY.equalsIgnoreCase(scheme)) {
            startNewActivity(MARKET_PREFIX + PACKAGE_NH_BANKPAY);
            return true;
        }
        if (MG_BANKPAY.equalsIgnoreCase(scheme)) {
            startNewActivity(MARKET_PREFIX + PACKAGE_MG_BANKPAY);
            return true;
        }
        if (KN_BANKPAY.equalsIgnoreCase(scheme)) {
            startNewActivity(MARKET_PREFIX + PACKAGE_KN_BANKPAY);
            return true;
        }


        return false;
    }


}