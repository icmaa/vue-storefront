import { mapGetters } from 'vuex'
import { googleTagManager } from 'config'
import { price } from 'icmaa-config/helpers/price'

export interface AttributeMapItem {
  field: string,
  name?: string,
  type?: string
}

export default {
  computed: {
    ...mapGetters({
      enabled: 'icmaaGoogleTagManager/enabled',
      getOptionLabel: 'attribute/getOptionLabel'
    })
  },
  methods: {
    getGTMProductDTO (item, attributeMap: string[] | AttributeMapItem[] = googleTagManager.productAttributes) {
      let product = {}

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
  }
}
