import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { extendStore } from '@vue-storefront/core/helpers'

import { RecommendationsStore } from './store'

export const IcmaaRecommendationsModule: StorefrontModule = function () {
  extendStore('icmaa-recommendations', RecommendationsStore)
}
