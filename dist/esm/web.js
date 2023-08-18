import { WebPlugin } from '@capacitor/core';
export class TossPaymentsCapacitorWeb extends WebPlugin {
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
//# sourceMappingURL=web.js.map