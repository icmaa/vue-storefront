import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { productThumbnailPath } from '@vue-storefront/core/helpers'
import { formatProductLink } from 'icmaa-url/helpers'
import ProductNameMixin from 'icmaa-catalog/mixins/ProductNameMixin'

import last from 'lodash-es/last'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  mixins: [ ProductNameMixin ],
  computed: {
    ...mapGetters({
      freeCartItems: 'cart/getFreeCartItems',
      getOptionLabel: 'attribute/getOptionLabel',
      getAttributeLabel: 'attribute/getAttributeLabel',
      isAddingToCart: 'cart/getIsAdding'
    }),
    hasProductInfo () {
      return this.product.info && Object.keys(this.product.info).length > 0
    },
    hasProductErrors () {
      return this.product.errors && Object.keys(this.product.errors).length > 0
    },
    isTotalsActive () {
      return this.isOnline && !this.editMode && this.product.totals && this.product.totals.options
    },
    thumbnail () {
      return productThumbnailPath(this.product)
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    productQty () {
      return this.product.qty
    },
    qtyOptions () {
      const limit = (this.productQty >= 5 ? this.productQty + 5 : 5)
      let options = []
      for (let value = 1; value <= limit; value++) {
        options.push({ label: value, value, selected: this.productQty === value })
      }
      return options
    },
    totals () {
      if (this.isTotalsActive) {
        return this.product.totals.options
      } else if (this.customProductOptions) {
        return this.customProductOptions
      }
      return []
    },
    customProductOptions () {
      return this.getCustomProductOptions(this.product)
    },
    isFree () {
      return this.freeCartItems.includes(this.product.sku)
    }
  },
  methods: {
    getCustomProductOptions (product) {
      if (product.product_option) {
        const { configurable_item_options, custom_options, bundle_options } = product.product_option.extension_attributes
        if (product.type_id === 'configurable') {
          /**
           * The `populateProductConfigurationAsync()` method already populate option label
           * and value into state for configurable product – nothing to do here.
           */
          return this.product.options
        } else if (product.type_id === 'bundle') {
          let options = []
          this.product.bundle_options.forEach(option => {
            bundle_options[option.option_id].option_selections.forEach(id => {
              const productLink = option.product_links.find(productLink => productLink.id === id)
              if (option.configurable_options && option.configurable_options.length > 0) {
                const attributeKey = option.configurable_options[0]['attribute_code']
                options.push({
                  label: this.getAttributeLabel({ attributeKey }),
                  value: this.getOptionLabel({ attributeKey, optionId: productLink[attributeKey] })
                })
              } else {
                options.push({
                  label: option.title,
                  value: this.trimLongBundleName(productLink.product.name)
                })
              }
            })
          })

          return options
        }
      }

      return []
    },
    trimLongBundleName (name) {
      if (name.length > 45) {
        name = last(name.split(' - '))
      }
      return name
    }
  }
}
