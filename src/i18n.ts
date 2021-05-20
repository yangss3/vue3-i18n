import { inject, provide, ref, App, readonly, InjectionKey, computed, WritableComputedRef } from 'vue'

interface Pack {
  [key: string]: string | Pack
}

interface Messages {
  [key: string]: Pack
}

export interface I18nConfig{
  locale: string;
  fallbackLocale?: string;
  messages: Messages;
}

export interface I18nInstance {
  messages: Messages;
  t: (key: string, payload?: Record<string, unknown>) => string;
  locale: WritableComputedRef<string>;
}

const recursiveRetrieve = (chain: string[], pack: Pack): string => {
  if (!pack[chain[0]] && pack[chain[0]] !== '') {
    throw new Error('Not Found')
  } else if (chain.length === 1) {
    return typeof pack[chain[0]] === 'string' ? pack[chain[0]] as string : ''
  } else {
    return recursiveRetrieve(chain.slice(1), pack[chain[0]] as Pack)
  }
}

function translate (pack: Pack, key: string, payload?: Record<string, unknown>) {
  let translation = ''
  if (typeof key !== 'string') {
    console.warn('Warn(i18n):', 'keypath must be a type of string')
  } else {
    try {
      const res = recursiveRetrieve(key.split('.'), pack)
      if (payload) {
        translation = Object.keys(payload).reduce((prev, cur) => {
          const regex = new RegExp(`\\{${cur}\\}`, 'g')
          return prev.replace(regex, String(payload[cur]))
        }, res)
      } else {
        translation = res
      }
    } catch (error) {
      console.warn(`Warn(i18n): the keypath '${key}' does not exist`)
      translation = key
    }
  }
  return translation
}

const _createI18n = (config: I18nConfig): I18nInstance => {
  const messages = readonly(config.messages)
  const _locale = ref(config.locale)
  const locale = computed({
    get: () => _locale.value,
    set: (loc: string) => {
      if (!messages[loc]) {
        if (config.fallbackLocale) {
          console.warn(`Warn(i18n): the '${loc}' language pack does not exist, fall back to ${config.fallbackLocale} language pack`)
        } else {
          console.error(`Error(i18n): the '${loc}' language pack does not exist`)
        }
      }
      _locale.value = loc
    }
  })

  const t = (key: string, payload?: Record<string, unknown>) => {
    const pack = messages[locale.value] || (config.fallbackLocale ? messages[config.fallbackLocale] : {})
    return translate(pack, key, payload)
  }
  return { messages, t, locale }
}

const i18nSymbol: InjectionKey<I18nInstance> = Symbol('i18n')

export function createI18n (config: I18nConfig) {
  const _i18n = _createI18n(config)
  const { messages, locale, fallbackLocale } = config
  const pack = messages[locale] || (fallbackLocale ? messages[fallbackLocale] : {})
  return {
    i18n: (app: App) => {
      app.provide(i18nSymbol, _i18n)
      app.config.globalProperties.$t = _i18n.t
      app.config.globalProperties.$i18n = _i18n
    },
    t: (key: string, payload?: Record<string, unknown>) => translate(pack, key, payload)
  }
}

export function provideI18n (config: I18nConfig): void {
  provide(i18nSymbol, _createI18n(config))
}

export function useI18n () {
  return inject(i18nSymbol)!
}
