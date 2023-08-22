import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(TossPaymentsCapacitor)
public class TossPaymentsCapacitor: CAPPlugin, TossPaymentsDelegate {
    
    var tossPaymentsViewController:TossPaymentsViewController? = nil;

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": value
        ])
    }
    
    @objc func startTossPaymentsActivity(_ call: CAPPluginCall) {
        DispatchQueue.main.async {

            self.tossPaymentsViewController = TossPaymentsViewController(call: call)

            self.tossPaymentsViewController?.delegate = self;
            self.bridge?.viewController!.present(self.tossPaymentsViewController!, animated: true, completion: nil)
        }
    }
    
    func onOver(role: String, url: String)
    {
        print("onOver Role:", role)
        let data = [
            "role" : role,
            "url" : url,
        ]
        self.notifyListeners("tossPaymentsOnOver", data: data)
    }
    
}

protocol TossPaymentsDelegate: AnyObject
{
    func onOver(role: String, url: String)
}
