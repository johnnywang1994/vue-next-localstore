import { inject } from 'vue';
import { localStoreKey } from './injectionSymbols';

export function useLocalStore() {
  return inject(localStoreKey);
}
