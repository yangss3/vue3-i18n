import { inject, provide, ref, App } from 'vue'

interface Messages {
  [key: string]: any
}

export interface I18nConfig {
  locale?: string
  messages: Messages
}

export interface I18nInstance {
  messages: Messages;
  t: (key:string) => string;
  setLocale: (locale: string) => void;
  getLocale: () => string;
}

const recursion = (chain: string[], messages: Messages): string => {
  if (!messages[chain[0]]) {
    console.error('Error(i18n):', 'not found')
    return ''
  } else if (chain.length === 1) {
    return typeof messages[chain[0]] === 'string' ? messages[chain[0]] : ''
  } else {
    return recursion(chain.slice(1), messages[chain[0]])
  }
}

const createI18n = (config: I18nConfig): I18nInstance => {
  const locale = ref(config.locale || 'en')
  const messages = config.messages
  const t = (key: string) => {
    if (typeof key !== 'string') {
      console.error('Error(i18n):', 'key must be a type of string')
      return ''
    }
    return recursion(key.split('.'), messages[locale.value])
  }
  const setLocale = (loc: string) => { locale.value = loc }
  const getLocale = () => locale.value

  return {
    messages,
    t,
    setLocale,
    getLocale
  }
}

const i18nSymbol = Symbol('i18n')

export default function globalI18n (app: App, config: I18nConfig):void {
  const i18n = createI18n(config)
  app.provide(i18nSymbol, i18n)
  app.config.globalProperties.$t = i18n.t
  app.config.globalProperties.$i18n = i18n
}

export function provideI18n (config: I18nConfig):void {
  provide(i18nSymbol, createI18n(config))
}

export function useI18n (): I18nInstance {
  return <I18nInstance>inject(i18nSymbol)
}
