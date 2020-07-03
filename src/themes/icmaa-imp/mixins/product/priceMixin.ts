import { price } from 'icmaa-config/helpers/price'

export default {
  computed: {
    hasMultiplePrices () {
      const product = this.product
      if (product.type_id === 'configurable' &&
        product.configurable_children &&
        product.configurable_children.length > 0
      ) {
        let price = 0
        return product.configurable_children.some(c => {
          if (!(c.stock.is_in_stock && c.stock.qty > 0)) {
            return false
          }

          const cPrice = c.price_incl_tax || c.original_price_incl_tax
          if (price === 0) {
            price = cPrice
            return false
          }

          return cPrice !== price
        })
      }
      return false
    }
  },
  methods: {
    price
  }
}
