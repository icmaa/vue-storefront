import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import AbstractMixin from './abstractMixin'

export default {
  mixins: [AbstractMixin],
  computed: {},
  methods: {
    checkoutSuccessGtm () {
      if (!this.enabled) {
        return;
      }

      const GTM: VueGtm = (Vue as any).gtm;

      const storeView = currentStoreView();
      const currencyCode = storeView.i18n.currencyCode;

      GTM.trackEvent({
        event: 'CheckoutSuccessView',
        ecommerce: {
          currencyCode: currencyCode,
          detail: {
            actionField: { list: '' }, // 'detail' actions have an optional list property.
            products: {}
          }
        }
      });
      console.log('hello from gtm-category-mixin!');
    }
  },
  mounted () {
    this.checkoutSuccessGtm();
  }
};
