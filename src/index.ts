import { registerPlugin } from '@capacitor/core';

import type { TossPaymentsCapacitorPlugin } from './definitions';

const TossPaymentsCapacitor = registerPlugin<TossPaymentsCapacitorPlugin>(
    'TossPaymentsCapacitor',
    {
        web: () => import('./web').then(m => new m.TossPaymentsCapacitorWeb()),
    },
);

export * from './definitions';
export * from './plugin';
export { TossPaymentsCapacitor };
