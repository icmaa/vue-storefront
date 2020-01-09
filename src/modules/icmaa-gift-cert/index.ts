import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { GiftCertStore } from './store'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export const IcmaaGiftCertModule: StorefrontModule = async function ({ store }) {
  store.registerModule('icmaaGiftCert', GiftCertStore)

  EventBus.$on('user-after-logout', result => {
    store.dispatch('icmaaGiftCert/clearGiftCert')
  })
}
