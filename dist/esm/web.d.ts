import { WebPlugin } from '@capacitor/core';
import { TPaymentMethod, TRequestParams, TossPaymentsCapacitorPlugin, TConfiguration } from './definitions';
export declare class TossPaymentsCapacitorWeb extends WebPlugin implements TossPaymentsCapacitorPlugin {
    initialize(options: TConfiguration): Promise<any>;
    private loadScript;
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
    requestPayment(method: TPaymentMethod, requestParams: TRequestParams, options?: any): Promise<{
        method: TPaymentMethod;
        requestParams: TRequestParams;
        options: any;
    }>;
    startTossPaymentsActivity(options: any): Promise<any>;
}
