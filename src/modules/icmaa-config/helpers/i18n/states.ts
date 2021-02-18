import { currentStoreView } from '@vue-storefront/core/lib/multistore'

const states = require('../../resource/i18n/states.json')

export const getStates = (defaultCountry?: string): { id: number, name: string, code: string }[] => {
  if (!defaultCountry) {
    defaultCountry = currentStoreView().i18n.defaultCountry
  }
  defaultCountry = (defaultCountry as string).toLowerCase()

  if (states[defaultCountry]) {
    return states[defaultCountry].map(c => {
      let [ id, code, name ] = c

      return { id, code, name }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }

  return []
}
