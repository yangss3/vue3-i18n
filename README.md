# vue3-i18n
A simple i18n plugin for Vue 3

## Install
```sh
npm install @yangss/vue3-i18n
```

## Usage
在 main.js 文件中引入 vue3-i18n
```js
import App from './App.vue'
import { createApp } from 'vue'
import { createI18n } from '@yangss/vue3-i18n'

const { i18n } = createI18n({
  locale: 'zhCN',
  fallbackLocale: 'zhCN',
  messages: {
    'zhCN': {
      hello: '你好',
      usa: '美国',
      china: '中国',
    },
    'enUS': {
      hello: 'Hello',
      usa: 'America',
      china: 'China',
    }
  }
})

createApp(App).use(i18n).mount('#app')
```
在组件中使用，App.vue
```html
<template>
  <button @click="switchLanguage">switch</button>
  <p>{{ $t('hello') }}</p>
  <p v-for="country in countries" :key="country">{{ country }}</p>
</template>

<script>
import { useI18n } from '@yangss/vue3-i18n'
export default {
  setup() {
    const { locale, t } = useI18n()
    return {
      switchLanguage: () => { locale.value = locale.value === 'zhCN' ? 'enUS' : 'zhCN' },
      countries: computed(() => [t('usa'), t('china')])
    }
  }
}
</script>
```
注意，`useI18n` 属于composition API，只能在 `setup` 的上下文中调用。如果要在其它地方进行多语言转换，可以使用普通版本的的 `t` 函数：

```js
// i18n.js
import { createI18n } from '@yangss/vue3-i18n'
const { i18n, t } = createI18n({
  locale: 'zhCN',
  fallbackLocale: 'zhCN',
  messages: {
    'zhCN': {
      hello: '你好',
      usa: '美国',
      china: '中国',
    },
    'enUS': {
      hello: 'Hello',
      usa: 'America',
      china: 'China',
    }
  }
})
export { i18n, t }

// main.js
// 注册 composition API
import App from './App.vue'
import { createApp } from 'vue'
import { i18n } from './i18n.js'
createApp(App).use(i18n) .mount('#app')

// anything.js
// 使用普通函数版本
import { t } from './i18n.js'
console.log(t('hello'))
```