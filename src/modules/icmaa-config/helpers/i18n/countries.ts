import { langs, registerLocale, getNames, getName } from 'i18n-iso-countries'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

interface Language {
  name: string,
  code: string
}

const countries = require('../../resource/i18n/countries.json')
const transCountries: Record<string, Language[]> = {}

export const getTranslatedCountries = (languageCode?: string): Language[] => {
  if (!languageCode) {
    const { i18n } = currentStoreView()
    languageCode = i18n.defaultLanguage
  }

  languageCode = (languageCode as string).toLowerCase()

  if (!langs().includes(languageCode)) {
    registerLocale(require(`i18n-iso-countries/langs/${languageCode}.json`))
  }

  if (!transCountries[languageCode]) {
    transCountries[languageCode] = countries
      .map(c => {
        let [ code, name ] = c
        if (languageCode && Object.values(getNames(languageCode)).length > 0) {
          name = getName(code, languageCode) || name
        }

        return { name, code }
      }).sort((a, b) => a.name.localeCompare(b.name))
  }

  return transCountries[languageCode]
}
