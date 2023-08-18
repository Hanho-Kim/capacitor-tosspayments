import { WebPlugin } from '@capacitor/core';
import {TPaymentMethod, TRequestParams, TossPaymentsCapacitorPlugin, TConfiguration} from './definitions';

export class TossPaymentsCapacitorWeb extends WebPlugin implements TossPaymentsCapacitorPlugin {
  initialize(options: TConfiguration): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        return this.loadScript().then(() => {
          console.log("TOSS INIT!")
          const w: any = window;
          resolve(w.TossPayments(options.clientKey));
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  private loadScript(): Promise<void> {
    console.log("LOAD START!")
    if (typeof document === 'undefined') {
      console.log("NOT DOM INIT!")
      return Promise.resolve();
    }
    const scriptId = 'tsPay';
    const scriptEl = document?.getElementById(scriptId);
    if (scriptEl) {
      return Promise.resolve();
    }

    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    return new Promise<void>(resolve => {
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
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  requestPayment(method: TPaymentMethod, requestParams: TRequestParams, options?: any) {
    return Promise.resolve({ method, requestParams, options });
  }

  startTossPaymentsActivity(options: any): Promise<any> {
    return Promise.resolve(options);
  }

}
