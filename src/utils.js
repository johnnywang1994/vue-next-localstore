export const inBrowser = typeof window !== 'undefined';

export const localStorage = inBrowser ? window.localStorage : Object.create(null);

export const VERSION_NAME_KEY = 'version_name';

export const EVENT_DATA_KEY = 'event_data';

export const ANONYMOUS = 'anonymous';

export function defineProp(target, key, options) {
  Object.defineProperty(target, key, options);
}
