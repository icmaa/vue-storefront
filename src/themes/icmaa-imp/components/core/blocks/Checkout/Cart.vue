<template>
  <div>
    <slot name="headline">
      <h2 class="t-mb-4 t-text-xl t-font-light">
        {{ $t('Shopping cart') }}
      </h2>
    </slot>
    <NoSsr>
      <div v-if="productsInCart.length">
        <Coupon />
        <ul class="t-mb-4">
          <Product
            v-for="product in productsInCart"
            :key="product.sku"
            :product="product"
          />
        </ul>
        <Totals />
        <ButtonComponent
          class="t-mt-6"
          size="sm"
          type="ghost"
          @click="editCart"
        >
          {{ $t('Edit your cart') }}
        </ButtonComponent>
      </div>
    </NoSsr>
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
