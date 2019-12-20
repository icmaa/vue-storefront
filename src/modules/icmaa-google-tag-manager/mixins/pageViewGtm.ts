import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  computed: {

  },
  methods: {
    pageViewGtm () {
      const GTM: VueGtm = (Vue as any).gtm;

      const storeView = currentStoreView();
      const currencyCode = storeView.i18n.currencyCode;

      GTM.trackView(
        'testpageviewvalue', currencyCode
      );
      console.log('hello from gtm-pageview-mixin!');
    }
  },
  mounted () {
    this.pageViewGtm();
  }
};
