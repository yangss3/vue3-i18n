import { inject, provide, ref, App, readonly } from 'vue'

interface Messages {
  [key: string]: any
}

export interface I18nConfig {
  locale?: string
  messages: Messages
}

// export interface I18nInstance {,
//   messages: Messages;
//   t: ComputedRef<(key: string) => string>;
//   setLocale: (locale: string) => void;
//   getLocale: () => string;
// }

const recursiveRetrieve = (chain: string[], messages: Messages): string => {
  if (!messages[chain[0]] && messages[chain[0]] !== '') {
    throw new Error('Not Found')
  } else if (chain.length === 1) {
    return typeof messages[chain[0]] === 'string' ? messages[chain[0]] : ''
  } else {
    return recursiveRetrieve(chain.slice(1), messages[chain[0]])
  }
}

const _createI18n = (config: I18nConfig) => {
  const locale = ref(config.locale || 'zh')
  const messages = readonly(config.messages)
  const t = (key: string) => {
    const pack = messages[locale.value] || messages.zh
    if (typeof key !== 'string') {
      console.warn('Warn(i18n):', 'keypath must be a type of string')
      return ''
    }
    try {
      return recursiveRetrieve(key.split('.'), pack)
    } catch (error) {
      console.warn(`Warn(i18n): the keypath '${key}' not found`)
      return key
    }
  }
  const setLocale = (loc: string) => {
    if (!messages[loc]) {
      console.warn(`Warn(i18n): the '${loc}' language pack not found, fall back to Chinese language pack`)
    }
    locale.value = loc
  }
  const getLocale = () => locale.value

  return {
    locale,
    messages,
    t,
    setLocale,
    getLocale
  }
}



const i18nSymbol = Symbol('i18n')

// export default function globalI18n (app: App, config: I18nConfig):void {
//   const i18n = _createI18n(config)
//   app.provide(i18nSymbol, i18n)
//   app.config.globalProperties.$t = i18n.t
//   app.config.globalProperties.$i18n = i18n
// }

export function createI18n (config: I18nConfig) {
  const i18n = _createI18n(config)
  return (app: App) => {
    app.provide(i18nSymbol, i18n)
    app.config.globalProperties.$t = i18n.t
    app.config.globalProperties.$i18n = i18n
  }
}

export function provideI18n (config: I18nConfig): void {
  provide(i18nSymbol, _createI18n(config))
}

export function useI18n () {
  return inject(i18nSymbol)
}
