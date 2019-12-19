import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  created: function () {
    this.pageViewGtm();
  },
  methods: {
    pageViewGtm: function () {
      const GTM: VueGtm = (Vue as any).gtm;

      const storeView = currentStoreView();
      const currencyCode = storeView.i18n.currencyCode;

      GTM.trackView({
        event: 'content-view',
        'currencyCode': currencyCode
      });

      console.log('hello from gtm-pageview-mixin!')
    }
  }
}
