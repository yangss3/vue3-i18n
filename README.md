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

const i18n = createI18n({
  locale: 'zhCN',
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
  <p>{{$t('hello')}}</p>
  <p v-for="country in countries" :key="country">{{country}}</p>
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