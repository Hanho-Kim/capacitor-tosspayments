var capacitorCapacitorTosspayments = (function (exports, core) {
    'use strict';

    class TossPayments {
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

    const TossPaymentsCapacitor = core.registerPlugin('TossPaymentsCapacitor', {
        web: () => Promise.resolve().then(function () { return web; }).then(m => new m.TossPaymentsCapacitorWeb()),
    });

    class TossPaymentsCapacitorWeb extends core.WebPlugin {
        initialize(options) {
            return new Promise((resolve, reject) => {
                try {
                    return this.loadScript().then(() => {
                        console.log("TOSS INIT!");
                        const w = window;
                        resolve(w.TossPayments(options.clientKey));
                    });
                }
                catch (err) {
                    reject(err);
                }
            });
        }
        loadScript() {
            console.log("LOAD START!");
            if (typeof document === 'undefined') {
                console.log("NOT DOM INIT!");
                return Promise.resolve();
            }
            const scriptId = 'tsPay';
            const scriptEl = document === null || document === void 0 ? void 0 : document.getElementById(scriptId);
            if (scriptEl) {
                return Promise.resolve();
            }
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            return new Promise(resolve => {
                script.defer = true;
                script.async = true;
                script.id = scriptId;
                script.onload = () => {
                    resolve();
                };
                script.src = `https://js.tosspayments.com/v1/payment`;
                head.appendChild(script);
            });
        }
        async echo(options) {
            console.log('ECHO', options);
            return options;
        }
        requestPayment(method, requestParams, options) {
            return Promise.resolve({ method, requestParams, options });
        }
        startTossPaymentsActivity(options) {
            return Promise.resolve(options);
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        TossPaymentsCapacitorWeb: TossPaymentsCapacitorWeb
    });

    exports.TossPayments = TossPayments;
    exports.TossPaymentsCapacitor = TossPaymentsCapacitor;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
