import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { CategoryStore } from './store'

export const IcmaaCategoryModule: StorefrontModule = function ({ store, router, appConfig }) {
  store.registerModule('icmaaCategory', CategoryStore)
}
