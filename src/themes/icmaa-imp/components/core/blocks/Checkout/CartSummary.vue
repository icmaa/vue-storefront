<template>
  <div>
    <h2 class="t-font-light t-text-xl t-mb-4">
      {{ $t('Shopping cart') }}
    </h2>
    <div v-if="productsInCart.length">
      <ul class="t-mb-4">
        <product
          v-for="product in productsInCart"
          :key="product.sku"
          :product="product"
        />
      </ul>
      <totals />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Product from 'theme/components/core/blocks/Microcart/Product'
import Totals from 'theme/components/core/blocks/Microcart/Totals'

export default {
  components: {
    Product,
    Totals
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems'
    })
  }
}
</script>
