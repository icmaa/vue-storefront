import { registerLocale, getNames, getName } from 'i18n-iso-countries'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

const countries = require('../../resource/i18n/countries.json')

export const getTranslatedCountries = (languageCode?: string): { name: string, code: string }[] => {
  if (!languageCode) {
    const { i18n } = currentStoreView()
    languageCode = i18n.defaultLanguage
  }

  languageCode = (languageCode as string).toLowerCase()

  return countries
    .map(c => {
      let [ code, name ] = c
      registerLocale(require(`i18n-iso-countries/langs/${languageCode}.json`))
      if (languageCode && Object.values(getNames(languageCode)).length > 0) {
        name = getName(code, languageCode) || name
      }

      return { name, code }
    }).sort((a, b) => a.name.localeCompare(b.name))
}
