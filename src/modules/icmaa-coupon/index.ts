import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { CouponStore } from './store'

export const IcmaaCouponModule: StorefrontModule = async function ({ store }) {
  store.registerModule('icmaaCoupon', CouponStore)
}
