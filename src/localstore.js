import { reactive, unref, computed } from 'vue';
import { localStoreKey } from './injectionSymbols';
import {
  localStorage,
  VERSION_NAME_KEY,
  EVENT_DATA_KEY,
  ANONYMOUS,
  defineProp,
} from './utils';

function setupLocalStore(app, localStore) {
  const { options, currentStore: store } = localStore;
  const newVersionName = options.versionName;
  const { versionNameKey, eventDataKey } = options;
  if (newVersionName === localStorage[versionNameKey]) {
    try {
      store.__data__[eventDataKey] = JSON.parse(localStorage[eventDataKey]);
    } catch {
      console.warn(`[vue-local-store] "${eventDataKey}" was not defined, use fallback empty object`);
      store.__data__[eventDataKey] = Object.create(null);
    }
  }
  localStore.setRoot(versionNameKey, newVersionName);
  localStore.refreshEventData();
}

function applyModalPlugin(app, localStore) {
  setupLocalStore(app, localStore);
  defineProp(app.config.globalProperties, '$localStore', {
    get: () => localStore,
  });
  app.provide(localStoreKey, localStore);
}

export function createLocalStore(options) {
  options.prefix = options.prefix || '';
  options.uid = options.uid || ANONYMOUS;
  options.versionNameKey = options.versionNameKey || VERSION_NAME_KEY;
  options.eventDataKey = options.eventDataKey || EVENT_DATA_KEY;

  const __data__ = reactive({
    [options.eventDataKey]: {},
  });
  const currentStore = { __data__ };

  /* methods */
  function setRoot(key, value) {
    const { versionNameKey } = options;
    // check version_name_locked
    if (key === versionNameKey && currentStore.__version_name_locked__) {
      console.warn(`[vue-local-store] key "${versionNameKey}" cannot be modified`);
      return;
    }

    if (typeof value === 'string') {
      localStorage[key] = value;
    } else {
      try {
        localStorage[key] = JSON.stringify(value);
      } catch {
        console.warn(`[vue-local-store] root key "${key}" failed to set`);
        return;
      }
    }
    __data__[key] = value;

    // lock version_name
    if (key === versionNameKey) {
      Object.defineProperty(currentStore, '__version_name_locked__', {
        get() { return true },
      });
    }
  }

  function getRoot(key) {
    return __data__[key];
  }

  function removeRoot(key) {
    __data__[key] = null;
    delete localStorage[key];
    delete __data__[key];
  }

  function set(key, value) {
    const { eventDataKey } = options;
    const skipKey = getPrefixedKey(key);
    __data__[eventDataKey][skipKey] = value;
    refreshEventData();
  }

  function get(key) {
    const { eventDataKey } = options;
    const skipKey = getPrefixedKey(key);
    return __data__[eventDataKey][skipKey];
  }

  function remove(key) {
    const { eventDataKey } = options;
    const skipKey = getPrefixedKey(key);
    __data__[eventDataKey][skipKey] = null;
    delete __data__[eventDataKey][skipKey];
    refreshEventData();
  }

  function refreshEventData() {
    const { eventDataKey } = options;
    setRoot(eventDataKey, __data__[eventDataKey] || Object.create(null));
  }

  function getPrefixedKey(key) {
    const { uid, prefix } = options;
    return `${prefix}${uid}_${key}`;
  }

  function setUid(uid) {
    if (!uid) return;
    options.uid = uid;
  }

  /* expose */
  const data = computed(() => __data__);
  const localStore = {
    currentStore,
    setRoot,
    getRoot,
    removeRoot,
    set,
    get,
    remove,
    refreshEventData,
    setUid,
    install(app) {
      applyModalPlugin(app, this);
    }
  };

  defineProp(localStore, 'versionName', { get: () => options.versionName });
  defineProp(localStore, 'options', { get: () => options });
  defineProp(localStore, 'data', { get: () => unref(data) });
  defineProp(localStore, '__version__', { get: () => 'v0.0.1' });
  return localStore;
}
