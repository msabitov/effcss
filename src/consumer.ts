// constants
import type { TProviderAttrParams } from './common';
import { useStyleProvider } from './index';

/**
 * Create style dispatcher
 * @param params - dispatcher params
 * @deprecated The function will be deleted in v4. Use `useStyleProvider` from `effcss` instead
 */
export const createConsumer = (attrs: Partial<TProviderAttrParams> = {}): ReturnType<typeof useStyleProvider> => useStyleProvider({attrs});
