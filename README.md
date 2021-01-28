# VueLocalStore

vue localStorage plugin with `prefix`, `unique id` injectable for vue3.x which can control version by `version_name` feature.

## Install

VueLocalStore is an umd module, you can easily use by cdn or es6 module

```bash
$ npm install vue-next-localstore
```


## Basic Introduction

### create instance

Same as vue-router, create localStore instance

```js
// localStore.js
import Vue from 'vue';
import { createLocalStore } from 'vue-next-localstore';

const localStore = createLocalStore({
  versionName: 'test_v0.0.1',
  versionNameKey: 'version_name', // default
  eventDataKey: 'event_data', // default
  prefix: '', // default
  uid: 'anonymous', // default: can be changed later by `setUid`
});

export default localStore;
```

### inject to vue intance

```js
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import localStore from './localStore';

createApp(App).use(localStore).mount('#app');
```

### access in option API component

```js
// App.vue
export default {
  mounted() {
    console.log(this.$localStore);
  },
};
```

### access in composition API component

```js
import { useLocalStore } from 'vue-next-localstore';

export default {
  setup() {
    const localStore = useLocalStore();
    localStore.set('name', 'johnny');
    return {
      ls: localStore,
    };
  },
};
```

### bind to template

```vue
<template>
  <div>
    {{ ls.get('name') }}
  </div>
</template>
```


## API Introduction

### setUid(uid)

set prefixed uid content, `uid` will be concat as bellow:

#### params
1. uid
  - type: `string`
  - default: `anonymous`

```js
const prefixedKey = `${prefix}${uid}_${key}`;
```

#### demo
```js
export default {
  created() {
    this.$localStore.setUid('good_uid_30678444');
  },
};
```

### setRoot(key, value)

set localstorage to root key(real localstorage)

#### params
1. key
  - type: `string`
2. value
  - type: `any`

#### demo
```js
export default {
  created() {
    this.$localStore.setRoot('name', 'Johnny');
  },
};
```

### getRoot(key)

get localStorage root key's value

#### params
1. key
  - type: `string`

#### demo
```js
export default {
  created() {
    this.$localStore.getRoot('name');
  },
};
```

### removeRoot(key)

remove localStorage root key

#### params
1. key
  - type: `string`

#### demo
```js
export default {
  created() {
    this.$localStore.removeRoot('name');
  },
};
```

### set(key, value)

set event data key with value, the key will be prefixed.

#### params
1. key
  - type: `string`
  - desc: will be auto prefixed before editing
2. value
  - type: `any`

#### demo
```js
export default {
  created() {
    this.$localStore.set('name', 'Johnny');
  },
};
```

### get(key)

get event data key's value, the key will be prefixed.

#### params
1. key
  - type: `string`
  - desc: will be auto prefixed before editing

#### demo
```js
export default {
  created() {
    this.$localStore.set('name', 'Johnny');
  },
};
```

### remove(key)

remove event data key, the key will be prefixed.

#### params
1. key
  - type: `string`
  - desc: will be auto prefixed before editing

#### demo
```js
export default {
  created() {
    this.$localStore.remove('name');
  },
};
```


## Configs

### versionName(required)

version_name for this content

### versionNameKey(optional, default: 'version_name')

localStorage key name for storing version_name

### eventDataKey(optional, default: 'event_data')

localStorage key name for storing event_data

### prefix(optional, default: '')

prefix value for event_data object's property

### uid(optional, default: 'anonymous')

inject uid to seperate user or other usage, can be modified later by `setUid` api.
