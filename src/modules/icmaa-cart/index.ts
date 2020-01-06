import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore } from '@vue-storefront/core/helpers'

import { IcmaaExtendedCartStore } from './store'

export const IcmaaExtendedCartModule: StorefrontModule = function ({ store }) {
  extendStore('cart', IcmaaExtendedCartStore)
}
