import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import PageViewGtmMixin from './pageViewGtm'

export default {
  mixins: [
    PageViewGtmMixin
  ],
  created: function () {
    this.categoryGtm()
  },
  methods: {
    categoryGtm: function () {
      const GTM: VueGtm = (Vue as any).gtm

      const storeView = currentStoreView()
      const currencyCode = storeView.i18n.currencyCode

      GTM.trackEvent({
        event: 'CategoryView',
        test: 'test',
        ecommerce: {
          detail: {
            actionField: { list: '' }, // 'detail' actions have an optional list property.
            products: {}
          }
        }
      });

      console.log('hello from gtm-category-mixin!')
    }
  }
};
