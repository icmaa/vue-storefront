import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore } from '@vue-storefront/core/helpers'

import { ExtendedUserStore } from './store'

const KEY = 'icmaa-user'

export const IcmaaExtendedUserModule: StorefrontModule = function () {
  extendStore('url', ExtendedUserStore)
}
