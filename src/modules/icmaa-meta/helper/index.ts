import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import defaultsDeep from 'lodash-es/defaultsDeep'

export const storeCode: Function = (): string => currentStoreView().storeCode || config.i18n.defaultLanguage.toLowerCase()
export const storeLang: Function = (): string => currentStoreView().i18n.defaultLocale || config.i18n.defaultLocale

export let mergeWithDefaults: any = (defaults: any, config: any) => {
  defaultsDeep(defaults, config)

  // @todo: Handle deep copy of Object[] to extend existing meta values etc.

  return defaults
}
