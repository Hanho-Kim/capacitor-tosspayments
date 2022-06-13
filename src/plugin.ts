import { Plugins } from '@capacitor/core';
import { TPaymentMethod, TRequestParams } from './definitions';

const { TossPaymentsPlugin } = Plugins;


export class TossPayments {
  private _clientKey:string;
  private _successCallback = (url:string) => { console.log(url) };
  private _failCallback = (url:string) => { console.log(url) }

  private _onOverListener:any;

  constructor(clientKey:string) {
    this._clientKey = clientKey;
  }

  echo(options: { value: string }): Promise<{ value: string }> {
    return TossPaymentsPlugin.echo(options);
  }

  async requestPayment(method: TPaymentMethod, requestParams: TRequestParams, options?: any):Promise<any> {
    if(!this._clientKey){
      return {success : false};
    }

    // Since Toss SDK needs success & fail url not callbacks, we save the callbacks in typescript scope and urls will be used inside of the native plugins
    this._successCallback = requestParams.successCallback || function(url){ console.log(url) };
    this._failCallback = requestParams.failCallback || function(url){ console.log(url) };

    let _requestParamsSanitizedForTossSDK = {
      ...requestParams,
      successCallback: undefined,
      failCallback: undefined,
      successUrl: 'http://toss-payments-after-success-url', // Overwrite Custom url scheme for communicating with native codes
      failUrl: 'http://toss-payments-after-fail-url', // Overwrite Custom url scheme for communicating with native codes
    };

    if(this._onOverListener) this._onOverListener.remove();
    this._onOverListener = TossPaymentsPlugin.addListener('tossPaymentsOnOver',({role, url}:{role:string, url:string})=>{
      console.log('[Capacitor: TossPaymentsPlugin] onOver:', {role, url});

      if(role === 'success'){
        this._successCallback(url);
      } else if (role === 'fail'){
        this._failCallback(url);
      }

      this._onOverListener.remove(); // Remove Listener
    })

    await TossPaymentsPlugin.startTossPaymentsActivity({
      clientKey: this._clientKey,
      method,
      requestParams : _requestParamsSanitizedForTossSDK,
      options,
    });

    return {success : true};
  }
}

