import { StorefrontModule } from '@vue-storefront/module'
import { extendStore } from '@vue-storefront/core/helpers'

import { ExtendedUrlStore } from './store'

export const IcmaaExtendedUrlModule: StorefrontModule = function (app, store, router, moduleConfig, appConfig) {
  extendStore('url', ExtendedUrlStore)
}
