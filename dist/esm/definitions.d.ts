import type { PluginListenerHandle } from '@capacitor/core';
export declare type TPaymentMethod = '카드' | '가상계좌' | '휴대폰' | '계좌이체' | '문화상품권' | '게임문화상품권' | '도서문화상품권' | 'CARD' | 'TOSSPAY' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'MOBILE_PHONE' | 'CULTURE_GIFT_CERTIFICATE' | 'BOOK_GIFT_CERTIFICATE' | 'GAME_GIFT_CERTIFICATE';
export declare type TRequestParams = {
    amount: number;
    orderId: string;
    orderName: string;
    successCallback: (...args: unknown[]) => unknown;
    failCallback: (...args: unknown[]) => unknown;
    successUrl?: string;
    failUrl?: string;
    windowTarget?: string;
    customerName?: string;
    customerEmail?: string;
    taxFreeAmount?: number;
    cultureExpense?: boolean;
};
export interface TConfiguration {
    clientKey: string;
}
export interface TossPaymentsCapacitorPlugin {
    initialize(options: TConfiguration): Promise<any>;
    echo(options: {
        value: string;
    }): Promise<{
        value: string;
    }>;
    requestPayment(method: TPaymentMethod, requestParams: TRequestParams, options?: any): Promise<any>;
    startTossPaymentsActivity(options: any): Promise<any>;
    addListener(name: string, callback: any): Promise<PluginListenerHandle> & PluginListenerHandle;
}
