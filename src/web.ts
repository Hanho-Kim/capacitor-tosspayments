import { WebPlugin } from '@capacitor/core';
import { TPaymentMethod, TRequestParams } from './definitions';

export class TossPaymentsPluginWeb extends WebPlugin {
  constructor() {
    super({
      name: 'TossPaymentsPlugin',
      platforms: ['web'],
    });
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  requestPayment(method: TPaymentMethod, requestParams: TRequestParams, options?: any) {
    return Promise.resolve({ method, requestParams, options });
  }

}

const TossPaymentsPlugin = new TossPaymentsPluginWeb();

export { TossPaymentsPlugin };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(TossPaymentsPlugin);
