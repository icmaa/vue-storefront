import Vue from 'vue'
import VueGtm from 'vue-gtm'
import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import AbstractMixin from './abstractMixin'

export default {
  mixins: [AbstractMixin],
  computed: {

  },
  methods: {
    productGtm () {
      if (!this.enabled) {
        return
      }

      const GTM: VueGtm = (Vue as any).gtm

      const storeView = currentStoreView()
      const currencyCode = storeView.i18n.currencyCode

      const getProduct = item => {
        let product = {}

        const attributeMap: string[] | Record<string, any>[] =
          config.googleTagManager.product_attributes
        attributeMap.forEach(attribute => {
          const isObject = typeof attribute === 'object'
          let attributeField = isObject ? Object.keys(attribute)[0] : attribute
          let attributeName = isObject
            ? Object.values(attribute)[0]
            : attribute

          if (
            item.hasOwnProperty(attributeField) ||
            product.hasOwnProperty(attributeName)
          ) {
            const value = item[attributeField] || product[attributeName]
            if (value) {
              product[attributeName] = value
            }
          }
        })
        return product
      }

      GTM.trackEvent({
        event: 'ProductView',
        testcategoryvalue: currencyCode,
        ecommerce: {
          detail: {
            actionField: { list: '' }, // 'detail' actions have an optional list property.
            products: [getProduct]
          }
        }
      })
      console.log('hello from gtm-product-mixin!')
    }
  },
  mounted () {
    this.productGtm()
  }
}
