export type TPaymentMethod = '카드' | '가상계좌' | '휴대폰' | '계좌이체' | '문화상품권' | '게임문화상품권' | '도서문화상품권' | 'CARD' | 'TOSSPAY' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'MOBILE_PHONE' | 'CULTURE_GIFT_CERTIFICATE' | 'BOOK_GIFT_CERTIFICATE' | 'GAME_GIFT_CERTIFICATE';
export type TRequestParams = {
  amount: number;
  orderId: string;
  orderName: string;
  successCallback: (...args: unknown[]) => unknown; // Only valid for native plugin
  failCallback: (...args: unknown[]) => unknown; // Only valid for native plugin
  successUrl?: string; // Only valid for web plugin
  failUrl?: string; // Only valid for web plugin
  windowTarget?: string;
  customerName?: string;
  customerEmail?: string;
  taxFreeAmount?: number;
  cultureExpense?: boolean;
};

declare module '@capacitor/core' {
  interface PluginRegistry {
    TossPaymentsPlugin: TossPaymentsPluginProtocol;
  }
}

export interface TossPaymentsPluginProtocol {

  echo(options: { value: string }): Promise<{ value: string }>;

  requestPayment(method:TPaymentMethod, requestParams:TRequestParams, options?:any): Promise<any>;

  startTossPaymentsActivity(options:any): Promise<any>;

  addListener(
    name: string,
    callback: any,
  ): any;
}
