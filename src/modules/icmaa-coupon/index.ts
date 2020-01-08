import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { CouponStore } from './store'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export const IcmaaCouponModule: StorefrontModule = async function ({ store }) {
  store.registerModule('icmaaCoupon', CouponStore)

  EventBus.$on('user-after-logout', result => {
    store.dispatch('icmaaCoupon/clearCoupon')
  })
}
