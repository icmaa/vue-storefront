import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'

export default {
  computed: {
    ...mapGetters({
      getAttributeLabel: 'attribute/getAttributeLabel'
    }),
    productOptions () {
      if (this.product.errors &&
          Object.keys(this.product.errors).length &&
          Object.keys(this.configuration).length
      ) {
        return []
      }
      return this.product.configurable_options || []
    },
    productOptionsLabels () {
      return this.productOptions.map(o => this.getAttributeLabel({ attributeKey: o.attribute_code }))
    },
    productOptionsLabel () {
      if (this.productOptions.length === 0 || this.productOptions.length > 1) {
        return i18n.t('Choose options')
      }

      return i18n.t('Choose {attribute}', { attribute: this.productOptionsLabels[0] })
    }
  }
}
