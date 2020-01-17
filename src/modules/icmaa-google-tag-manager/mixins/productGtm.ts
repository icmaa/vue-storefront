import Vue from 'vue'
import VueGtm from 'vue-gtm'
import { mapGetters } from 'vuex'
import { googleTagManager } from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { price } from 'icmaa-config/helpers/price'
import AbstractMixin from './abstractMixin'

interface AttributeMapItem {
  field: string,
  name?: string,
  type?: string
}

export default {
  mixins: [AbstractMixin],
  computed: {
    ...mapGetters({
      getOptionLabel: 'attribute/getOptionLabel'
    })
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

        const attributeMap: string[] | AttributeMapItem[] = googleTagManager.product_attributes
        attributeMap.forEach(attribute => {
          const isObject = typeof attribute === 'object'
          const attributeField: string = isObject ? attribute.field : attribute
          const attributeName: string = isObject ? attribute.name || attributeField : attribute
          const attributeType: string|boolean = isObject ? attribute.type || false : false

          if (
            item.hasOwnProperty(attributeField) ||
            product.hasOwnProperty(attributeName)
          ) {
            const value = item[attributeField] || product[attributeName]
            if (value) {
              switch (attributeType) {
                case 'price':
                  product[attributeName] = price(value)
                  break
                case 'attribute':
                  product[attributeName] = this.getOptionLabel({ attributeKey: attributeField, optionId: value })
                  break
                default:
                  product[attributeName] = value
              }
            }
          }
        })
        return product
      }

      GTM.trackEvent({
        event: 'icmaa-product-view',
        ecommerce: {
          currencyCode: currencyCode,
          detail: {
            actionField: { list: '' }, // 'detail' actions have an optional list property.
            products: [getProduct(this.product)]
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
