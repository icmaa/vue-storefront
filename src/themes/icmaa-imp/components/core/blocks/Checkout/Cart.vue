<template>
  <div>
    <h2 class="t-font-light t-text-xl t-mb-4">
      {{ $t('Shopping cart') }}
    </h2>
    <no-ssr>
      <div v-if="productsInCart.length">
        <coupon />
        <ul class="t-mb-4">
          <product
            v-for="product in productsInCart"
            :key="product.sku"
            :product="product"
          />
        </ul>
        <totals />
        <button-component
          class="t-mt-6"
          size="sm"
          @click="editCart"
        >
          {{ $t('Edit your cart') }}
        </button-component>
      </div>
    </no-ssr>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Product from 'theme/components/core/blocks/Checkout/Cart/Product'
import Totals from 'theme/components/core/blocks/Microcart/Totals'
import Coupon from 'theme/components/core/blocks/Microcart/Coupon'
import ButtonComponent from 'theme/components/core/blocks/Button'
import NoSsr from 'vue-no-ssr'
import { localizedRoute } from '@vue-storefront/core/lib/multistore'

export default {
  components: {
    Product,
    Totals,
    Coupon,
    ButtonComponent,
    NoSsr
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems'
    })
  },
  methods: {
    editCart () {
      this.$router.push(localizedRoute('/?fwd=cart'))
    }
  }
}
</script>
