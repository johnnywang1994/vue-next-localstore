export function createLocalStore(options: LocalStoreOptions): LocalStore;

export function useLocalStore(): LocalStore;

export interface LocalStoreOptions {
  versionName: string;
  versionNameKey?: string;
  eventDataKey?: string;
  prefix?: string;
  uid?: string;
}

export interface LocalStore {
  currentStore: any;
  getRoot(key: string): any;
  setRoot(key: string, value: any): void;
  removeRoot(key: string): void;
  syncRootData(): void;
  get(key: string): any;
  set(key: string, value: any): void;
  remove(key: string): void;
  refreshEventData(): void;
  setUid(uid: string): void;
  install(app: any): void;
}