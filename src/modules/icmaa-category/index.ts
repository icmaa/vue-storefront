import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'

const KEY = 'icmaa-category'

const moduleConfig: VueStorefrontModuleConfig = {
  key: KEY
}

export const IcmaaCms = new VueStorefrontModule(moduleConfig)
