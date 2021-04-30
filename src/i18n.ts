import { inject, provide, ref, App, readonly, InjectionKey, computed, WritableComputedRef } from 'vue'

interface Messages {
  [key: string]: any;
}

export interface I18nConfig{
  locale: string;
  fallbackLocale?: string;
  messages: Messages;
}

export interface I18nInstance {
  messages: Messages;
  t: (key: string) => string;
  locale: WritableComputedRef<string>;
}

const recursiveRetrieve = (chain: string[], messages: Messages): string => {
  if (!messages[chain[0]] && messages[chain[0]] !== '') {
    throw new Error('Not Found')
  } else if (chain.length === 1) {
    return typeof messages[chain[0]] === 'string' ? messages[chain[0]] : ''
  } else {
    return recursiveRetrieve(chain.slice(1), messages[chain[0]])
  }
}

const _createI18n = (config: I18nConfig): I18nInstance => {
  const messages = readonly(config.messages)
  const _locale = ref(config.locale)
  const locale = computed({
    get: () => _locale.value,
    set: (loc: string) => {
      if (!messages[loc]) {
        if (config.fallbackLocale) {
          console.warn(`Warn(i18n): the '${loc}' language pack not found, fall back to ${config.fallbackLocale} language pack`)
        } else {
          console.error(`Error(i18n): the '${loc}' language pack not found`)
        }
      }
      _locale.value = loc
    }
  })

  const t = (key: string) => {
    const pack = messages[locale.value] ||
      (config.fallbackLocale ? messages[config.fallbackLocale] : {})
    let translation = ''
    if (typeof key !== 'string') {
      console.warn('Warn(i18n):', 'keypath must be a type of string')
    } else {
      try {
        translation = recursiveRetrieve(key.split('.'), pack)
      } catch (error) {
        console.warn(`Warn(i18n): the keypath '${key}' not found`)
        translation = key
      }
    }
    return translation
  }

  return {
    messages,
    t,
    locale
  }
}

const i18nSymbol: InjectionKey<I18nInstance> = Symbol('i18n')

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
  return inject(i18nSymbol)!
}

export function createI18nRaw ({ messages, locale, fallbackLocale }: I18nConfig) {
  return (key: string) => {
    const pack = messages[locale] || (fallbackLocale ? messages[fallbackLocale] : {})
    let translation = ''
    if (typeof key !== 'string') {
      console.warn('Warn(i18n):', 'keypath must be a type of string')
    } else {
      try {
        translation = recursiveRetrieve(key.split('.'), pack)
      } catch (error) {
        console.warn(`Warn(i18n): the keypath '${key}' not found`)
        translation = key
      }
    }
    return translation
  }
}
