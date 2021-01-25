import { isServer } from '@vue-storefront/core/helpers'
import areIntlLocalesSupported from 'intl-locales-supported'

export const importIntlPolyfill = async () => {
  const IntlPolyfill = await import(/* webpackChunkName: 'intl-polyfill' */ 'intl')
  global.Intl = IntlPolyfill.default
}

export const checkForIntlPolyfill = async (storeView) => {
  const globDTO = typeof window !== 'undefined' ? window : global
  if (isServer && (!globDTO.hasOwnProperty('Intl') || !areIntlLocalesSupported(storeView.i18n.defaultLocale))) {
    await importIntlPolyfill()
  }
}
