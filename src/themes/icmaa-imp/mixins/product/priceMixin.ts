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

          const cPrice = c.price_incl_tax || product.price_incl_tax
          if (price === 0) {
            price = cPrice
            return false
          }

          return cPrice !== price
        })
      }
      return false
    },
    lowestPriceInclTax () {
      const product = this.product
      let key = 'price_incl_tax'

      if (product.type_id === 'configurable' &&
        product.configurable_children &&
        product.configurable_children.length > 0
      ) {
        const cheapestProduct = product.configurable_children.reduce((a, b) => {
          if (!a.stock || !a.stock.is_in_stock || a.stock.qty === 0) {
            return b
          }

          const aPrice = a[key] || product[key]
          const bPrice = b[key] || product[key]

          return aPrice <= bPrice ? a : b
        }, {})

        return cheapestProduct[key] || product[key] || 0
      }

      return product[key]
    }
  },
  methods: {
    price
  }
}
