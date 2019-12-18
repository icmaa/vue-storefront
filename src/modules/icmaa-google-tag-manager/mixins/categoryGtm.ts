import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {

  created: function () {
    this.categoryGtm()
  },
  methods: {
    categoryGtm: function () {
      const GTM: VueGtm = (Vue as any).gtm

      const storeView = currentStoreView()
      const currencyCode = storeView.i18n.currencyCode

      GTM.trackEvent({
        event: 'categoryView',
        ecommerce: {
          detail: {
            'actionField': { 'list': '' }, // 'detail' actions have an optional list property.
            'products': {
            }
          }
        }
      });
      console.log('hello from gtm-category-mixin!')
    }
  }
}
