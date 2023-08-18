import { TossPaymentsCapacitor } from "./index";
export class TossPayments {
    constructor(clientKey) {
        this._successCallback = (url) => { console.log(url); };
        this._failCallback = (url) => { console.log(url); };
        this._clientKey = clientKey;
    }
    echo(options) {
        return TossPaymentsCapacitor.echo(options);
    }
    async requestPayment(method, requestParams, options) {
        if (!this._clientKey) {
            return { success: false };
        }
        // Since Toss SDK needs success & fail url not callbacks, we save the callbacks in typescript scope and urls will be used inside of the native plugins
        this._successCallback = requestParams.successCallback || function (url) { console.log(url); };
        this._failCallback = requestParams.failCallback || function (url) { console.log(url); };
        let _requestParamsSanitizedForTossSDK = Object.assign(Object.assign({}, requestParams), { successCallback: undefined, failCallback: undefined, successUrl: 'http://toss-payments-after-success-url', failUrl: 'http://toss-payments-after-fail-url' });
        if (this._onOverListener)
            this._onOverListener.remove();
        this._onOverListener = await TossPaymentsCapacitor.addListener('tossPaymentsOnOver', ({ role, url }) => {
            console.log('[Capacitor: TossPaymentsPlugin] onOver:', { role, url });
            if (role === 'success') {
                this._successCallback(url);
            }
            else if (role === 'fail') {
                this._failCallback(url);
            }
            this._onOverListener.remove(); // Remove Listener
        });
        await TossPaymentsCapacitor.startTossPaymentsActivity({
            clientKey: this._clientKey,
            method,
            requestParams: _requestParamsSanitizedForTossSDK,
            options,
        });
        return { success: true };
    }
}
//# sourceMappingURL=plugin.js.map