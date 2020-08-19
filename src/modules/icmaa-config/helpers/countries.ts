import { registerLocale, getNames, getName } from 'i18n-iso-countries'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

const VsfCountries = require('@vue-storefront/i18n/resource/countries.json')

export const getTranslatedCountries = (languageCode?: string) => VsfCountries.map(c => {
  if (!languageCode) {
    languageCode = currentStoreView().i18n.defaultLanguage
  }
  languageCode = (languageCode as string).toLowerCase()

  registerLocale(require(`i18n-iso-countries/langs/${languageCode}.json`))
  if (languageCode && Object.values(getNames(languageCode)).length > 0) {
    c.name = getName(c.code, languageCode) || c.name
  }

  return c
}).sort((a, b) => a.name.localeCompare(b.name))
