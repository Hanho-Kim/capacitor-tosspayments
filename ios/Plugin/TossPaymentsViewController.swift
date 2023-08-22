import Foundation
import Capacitor
import UIKit
import WebKit

class TossPaymentsViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {
    weak var delegate:TossPaymentsDelegate?
    var webView: WKWebView!
    var clientKey: String!
    var method: String! // ex. CARD ...
    var requestParamsStringified: String! // Toss Request Params Strigified
    var requestParams: [String : Any]!
    
    var loadingFinished: Bool = false
    
    convenience init(call: CAPPluginCall) {
        print("[TossPayments]: init!");
        self.init()
        NotificationCenter.default.addObserver(self, selector: #selector(self.onDidReceiveData(_:)), name: Notification.Name(Notification.Name.capacitorOpenURL.rawValue), object: nil)
        
        self.clientKey = call.getString("clientKey")
        self.requestParams = call.getObject("requestParams")
        self.requestParamsStringified = self.objectStringify(data: self.requestParams)
        self.method = call.getString("method");
        
        
//        let appScheme = data["app_scheme"]
//        if (appScheme != nil) {
//            self.appScheme = appScheme as! String
//        }
//        self.triggerCallback = call.getString("triggerCallback") ?? ""
//        self.redirectUrl = call.getString("redirectUrl") ?? "http://detectchangingwebview/iamport/capacitor"
    }
    
    override func loadView() {
        print("[TossPayments]: loadView!");
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.uiDelegate = self
        webView.navigationDelegate = self
        view = webView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        print("[TossPayments]: viewDidLoad!");
        let tossPaymentsBundle = Bundle(for: TossPaymentsCapacitor.self)
        let WEBVIEW_PATH = tossPaymentsBundle.url(forResource: "webview_source", withExtension: "html");
        if WEBVIEW_PATH != nil {
            let myRequest = URLRequest(url: WEBVIEW_PATH!)
            webView.load(myRequest)
        }
    }
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        delegate?.onOver(role: "fail", url: "https://nerdfrenz.com?code=user_close&message=canceled")
    }
    /* Lifecycle: Url has been changed */
    @available (iOS 8.0, *)
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        let navigationUrl = navigationAction.request.url!
        let url = navigationUrl.absoluteString;
        print("[TossPayments]: url changed", url);
        let urlRole = self.pipeUrlRole(url: url);
        print("[TossPayments]: url Role", urlRole);
        
        if(urlRole == "success" || urlRole == "fail"){ // Success or Fail Callback Url
            self.webView.stopLoading()
            self.webView.removeFromSuperview()
            self.webView.navigationDelegate = nil
            self.webView = nil
            
            self.dismiss(animated: true)
            delegate?.onOver(role: urlRole, url: url)
            
            decisionHandler(.cancel)
        } else if (urlRole == "appScheme"){ // AppScheme
            self.openThirdPartyApp(url: url)
            decisionHandler(.cancel)
        } else { // Normal Http Call
            decisionHandler(.allow)
        }
        
    }
    
    /* Lifecycle: After Loading Finished */
    @available(iOS 8.0, *)
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!){
        if (!loadingFinished) {
            print("[TossPayments]: loadingFinished => Call Javascript");
            webView.evaluateJavaScript("var tossPayments = TossPayments('" + self.clientKey + "');")
            webView.evaluateJavaScript("tossPayments.requestPayment('" + self.method + "', " + self.requestParamsStringified + ");")
            
            self.loadingFinished = true
        }
    }
    
    func pipeUrlRole(url: String) -> String {
        let successUrl = self.requestParams["successUrl"] as! String
        let failUrl = self.requestParams["failUrl"] as! String
        
        if(url.hasPrefix(successUrl)){
            return "success";
        } else if (url.hasPrefix(failUrl)){
            return "fail";
        }
        
        if(self._isUrlStartsWithAppScheme(url: url)){
            return "appScheme";
        }
    
        return "https";
    }
    
    
    func _isUrlStartsWithAppScheme(url : String) -> Bool {
        let splittedScheme = url.components(separatedBy: "://");
        let scheme = splittedScheme[0];
        return scheme != "http" && scheme != "https" && scheme != "about:blank" && scheme != "file";
    }
    
    
    func objectStringify(data: [String: Any]) -> String {
        do {
            let data = try JSONSerialization.data(withJSONObject: data, options: .prettyPrinted)
            return String(data: data, encoding: String.Encoding.utf8) ?? ""
        } catch {
            return ""
        }
    }
    
    func openThirdPartyApp(url: String) {
        print("[tossPayments] openThirdPartyApp", url)
        let splittedUrl = url.components(separatedBy: "://")
        let scheme = splittedUrl[0]
        let path = splittedUrl[1]
        
        let appUrl = URL(string: self.getAppUrl(url: url, scheme: scheme, path: path))!
        let Application = UIApplication.shared
        if (Application.canOpenURL(appUrl)) {
            print("[tossPayments] canOpenUrl: true")
            Application.open(appUrl, options: [:], completionHandler: nil)
        } else {
            print("[tossPayments] canOpenUrl: false, open marketUrl instead")
            let marketUrl = URL(string: self.getMarketUrl(url: url, scheme: scheme))!
            Application.open(marketUrl, options: [:], completionHandler: nil)
        }
    }
    
    func getAppUrl(url: String, scheme: String, path: String) -> String {
        return scheme == "itmss" ? "https://" + path : url
    }
    
    func getMarketUrl(url: String, scheme: String) -> String {
        switch (scheme) {
        case "ispmobile": // ISP/페이북
            return "https://itunes.apple.com/kr/app/id369125087";
        case "hdcardappcardansimclick": // 현대카드 앱카드
            return "https://itunes.apple.com/kr/app/id702653088";
        case "shinhan-sr-ansimclick": // 신한 앱카드
            return "https://itunes.apple.com/app/id572462317";
        case "kb-acp": // KB국민 앱카드
            return "https://itunes.apple.com/kr/app/id695436326";
        case "mpocket.online.ansimclick": // 삼성앱카드
            return "https://itunes.apple.com/kr/app/id535125356";
        case "lottesmartpay": // 롯데 모바일결제
            return "https://itunes.apple.com/kr/app/id668497947";
        case "lotteappcard": // 롯데 앱카드
            return "https://itunes.apple.com/kr/app/id688047200";
        case "cloudpay": // 하나1Q페이(앱카드)
            return "https://itunes.apple.com/kr/app/id847268987";
        case "citimobileapp": // 시티은행 앱카드
            return "https://itunes.apple.com/kr/app/id1179759666";
        case "payco": // 페이코
            return "https://itunes.apple.com/kr/app/id924292102";
        case "kakaotalk": // 카카오톡
            return "https://itunes.apple.com/kr/app/id362057947";
        case "lpayapp": // 롯데 L.pay
            return "https://itunes.apple.com/kr/app/id1036098908";
        case "wooripay": // 우리페이
            return "https://itunes.apple.com/kr/app/id1201113419";
        case "nhallonepayansimclick": // NH농협카드 올원페이(앱카드)
            return "https://itunes.apple.com/kr/app/id1177889176";
        case "hanawalletmembers": // 하나카드(하나멤버스 월렛)
            return "https://itunes.apple.com/kr/app/id1038288833";
        case "shinsegaeeasypayment": // 신세계 SSGPAY
            return "https://itunes.apple.com/app/id666237916";
        case "chaipayment":
            return "https://itunes.apple.com/app/id1459979272";
        case "kb-auth":
            return "https://itunes.apple.com/app/id695436326";
        case "hyundaicardappcardid":
            return "https://itunes.apple.com/app/id702653088";
        case "lmslpay":
            return "https://itunes.apple.com/app/id473250588";
        case "com.wooricard.wcard":
            return "https://itunes.apple.com/app/id1499598869";
        case "lguthepay-xpay":
            return "https://itunes.apple.com/app/id760098906";
        case "liivbank":
            return "https://itunes.apple.com/app/id1126232922";
        case "supertoss":
            return "https://itunes.apple.com/app/id839333328";
        case "newsmartpib":
            return "https://itunes.apple.com/app/id1470181651";
        default:
            return url;
        }
    }
    
    @objc func onDidReceiveData(_ notification: Notification) {}
}
