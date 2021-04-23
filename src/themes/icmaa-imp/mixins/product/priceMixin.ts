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
    },
    minimalPrice () {
      const product = this.product
      if (product.type_id === 'configurable' &&
        product.configurable_children &&
        product.configurable_children.length > 0
      ) {
        const cheapestProduct = product.configurable_children.reduce((a, b) => {
          if (!a.stock.is_in_stock || a.stock.qty === 0) {
            return b
          }
          const aPrice = a.price_incl_tax || a.original_price_incl_tax
          const bPrice = b.price_incl_tax || b.original_price_incl_tax

          return aPrice < bPrice ? a : b
        }, {})

        return cheapestProduct.price_incl_tax || cheapestProduct.original_price_incl_tax || 0
      }

      return product.price_incl_tax
    }
  },
  methods: {
    price
  }
}
