(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueLocalStore = {}, global.Vue));
}(this, (function (exports, vue) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var hasSymbol = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';
  var PolySymbol = function PolySymbol(name) {
    return hasSymbol ? Symbol('[vue-next-localstore]: ' + name) : '[vue-next-localstore]: ' + name;
  };
  var localStoreKey = PolySymbol('localStore');

  var inBrowser = typeof window !== 'undefined';
  var localStorage = inBrowser ? window.localStorage : Object.create(null);
  var VERSION_NAME_KEY = 'version_name';
  var EVENT_DATA_KEY = 'event_data';
  var ANONYMOUS = 'anonymous';
  function defineProp(target, key, options) {
    Object.defineProperty(target, key, options);
  }

  function setupLocalStore(app, localStore) {
    var options = localStore.options,
        store = localStore.currentStore;
    var newVersionName = options.versionName;
    var versionNameKey = options.versionNameKey,
        eventDataKey = options.eventDataKey;

    if (newVersionName === localStorage[versionNameKey]) {
      try {
        store.__data__[eventDataKey] = JSON.parse(localStorage[eventDataKey]);
      } catch (_unused) {
        console.warn("[vue-local-store] \"".concat(eventDataKey, "\" was not defined, use fallback empty object"));
        store.__data__[eventDataKey] = Object.create(null);
      }
    }

    localStore.setRoot(versionNameKey, newVersionName);
    localStore.syncRootData();
    localStore.refreshEventData();
  }

  function applyModalPlugin(app, localStore) {
    setupLocalStore(app, localStore);
    defineProp(app.config.globalProperties, '$localStore', {
      get: function get() {
        return localStore;
      }
    });
    app.provide(localStoreKey, localStore);
  }

  function createLocalStore(options) {
    options.prefix = options.prefix || '';
    options.uid = options.uid || ANONYMOUS;
    options.versionNameKey = options.versionNameKey || VERSION_NAME_KEY;
    options.eventDataKey = options.eventDataKey || EVENT_DATA_KEY;

    var __data__ = vue.reactive(_defineProperty({}, options.eventDataKey, {}));

    var currentStore = {
      __data__: __data__
    };
    /* methods */

    function setRoot(key, value) {
      var versionNameKey = options.versionNameKey; // check version_name_locked

      if (key === versionNameKey && currentStore.__version_name_locked__) {
        console.warn("[vue-local-store] key \"".concat(versionNameKey, "\" cannot be modified"));
        return;
      }

      if (typeof value === 'string') {
        localStorage[key] = value;
      } else {
        try {
          localStorage[key] = JSON.stringify(value);
        } catch (_unused2) {
          console.warn("[vue-local-store] root key \"".concat(key, "\" failed to set"));
          return;
        }
      }

      __data__[key] = value; // lock version_name

      if (key === versionNameKey) {
        Object.defineProperty(currentStore, '__version_name_locked__', {
          get: function get() {
            return true;
          }
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

    function syncRootData() {
      var keyList = Object.keys(localStorage);
      var eventDataKey = options.eventDataKey;
      keyList.forEach(function (key) {
        if (key === eventDataKey) return;
        var value;

        try {
          value = JSON.parse(localStorage[key]);
        } catch (_unused3) {
          value = localStorage[key];
        } finally {
          __data__[key] = value;
        }
      });
    }

    function set(key, value) {
      var eventDataKey = options.eventDataKey;
      var skipKey = getPrefixedKey(key);
      __data__[eventDataKey][skipKey] = value;
      refreshEventData();
    }

    function get(key) {
      var eventDataKey = options.eventDataKey;
      var skipKey = getPrefixedKey(key);
      return __data__[eventDataKey][skipKey];
    }

    function remove(key) {
      var eventDataKey = options.eventDataKey;
      var skipKey = getPrefixedKey(key);
      __data__[eventDataKey][skipKey] = null;
      delete __data__[eventDataKey][skipKey];
      refreshEventData();
    }

    function refreshEventData() {
      var eventDataKey = options.eventDataKey;
      setRoot(eventDataKey, __data__[eventDataKey] || Object.create(null));
    }

    function getPrefixedKey(key) {
      var uid = options.uid,
          prefix = options.prefix;
      return "".concat(prefix).concat(uid, "_").concat(key);
    }

    function setUid(uid) {
      if (!uid) return;
      options.uid = uid;
    }
    /* expose */


    var data = vue.computed(function () {
      return __data__;
    });
    var localStore = {
      currentStore: currentStore,
      setRoot: setRoot,
      getRoot: getRoot,
      removeRoot: removeRoot,
      syncRootData: syncRootData,
      set: set,
      get: get,
      remove: remove,
      refreshEventData: refreshEventData,
      setUid: setUid,
      install: function install(app) {
        applyModalPlugin(app, this);
      }
    };
    defineProp(localStore, 'versionName', {
      get: function get() {
        return options.versionName;
      }
    });
    defineProp(localStore, 'options', {
      get: function get() {
        return options;
      }
    });
    defineProp(localStore, 'data', {
      get: function get() {
        return vue.unref(data);
      }
    });
    defineProp(localStore, '__version__', {
      get: function get() {
        return 'v0.0.1';
      }
    });
    return localStore;
  }

  function useLocalStore() {
    return vue.inject(localStoreKey);
  }

  exports.createLocalStore = createLocalStore;
  exports.useLocalStore = useLocalStore;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
