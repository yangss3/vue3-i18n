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
  locale: 'zh-CN',
  message: {
    'zh-CN': {
      hello: '你好'
    },
    'en-US': {
      hello: 'Hello'
    }
  }
})

createApp(App).use(i18n).mount('#app')

```
在组件中使用，App.vue
```html
<template>
  <p>{{$t('hello')}}</p>
  <button @click="switchLanguage">switch</button>
</template>

<script>
import { useI18n } from '@yangss/vue3-i18n'
export default {
  setup() {
    const i18n = useI18n()
    switchLanguage() {
      if (i18n.getLocale() === 'zh-CN') {
        i18n.setLocale('en-US')
      } else {
        i18n.setLocale('zh-CN')
      }
    }

    return {
      switchLanguage
    }
  }
}
</script>
```