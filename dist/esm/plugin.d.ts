import { TPaymentMethod, TRequestParams } from './definitions';
export declare class TossPayments {
    private _clientKey;
    private _successCallback;
    private _failCallback;
    private _onOverListener;
    constructor(clientKey: string);
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
    requestPayment(method: TPaymentMethod, requestParams: TRequestParams, options?: any): Promise<any>;
}
