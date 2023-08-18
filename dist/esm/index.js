import { registerPlugin } from '@capacitor/core';
const TossPaymentsCapacitor = registerPlugin('TossPaymentsCapacitor', {
    web: () => import('./web').then(m => new m.TossPaymentsCapacitorWeb()),
});
export * from './definitions';
export * from './plugin';
export { TossPaymentsCapacitor };
//# sourceMappingURL=index.js.map