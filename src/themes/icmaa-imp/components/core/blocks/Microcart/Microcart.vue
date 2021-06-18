<template>
  <sidebar :title="$t('Shopping cart')" class="microcart t-relative" data-test-id="MicroCart">
    <template v-slot:top-after-title>
      <button-component v-if="productsInCart.length" type="transparent" size="sm" icon="delete" :icon-only="true" @click="clearCart">
        {{ $t('Clear cart') }}
      </button-component>
    </template>
    <div class="t-pb-24">
      <h4 v-if="!productsInCart.length" class="t-text-sm">
        {{ $t('Your shopping cart is empty.') }}
      </h4>
      <template v-if="productsInCart.length">
        <coupon />
        <ul class="t-mb-4">
          <product v-for="(product, i) in productsInCart" :key="`cart-${i}-${product.checksum || product.sku}`" :product="product" />
        </ul>
        <totals class="t-mb-4" />
        <template v-if="!isCheckoutMode">
          <button-component type="primary" class="t-w-full" @click.native="continueShopping(true)">
            {{ $t('Go to checkout') }}
          </button-component>
          <button-component type="transparent" class="t-w-full t-mt-2" @click.native="continueShopping()">
            {{ $t('Continue shopping') }}
          </button-component>
        </template>
      </template>
    </div>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import VueOfflineMixin from 'vue-offline/mixin'
import ButtonComponent from 'theme/components/core/blocks/Button'
import Sidebar from 'theme/components/core/blocks/AsyncSidebar/Sidebar'
import Product from 'theme/components/core/blocks/Microcart/Product'
import Totals from 'theme/components/core/blocks/Microcart/Totals'
import Coupon from 'theme/components/core/blocks/Microcart/Coupon'

export default {
  name: 'MicroCart',
  components: {
    ButtonComponent,
    Coupon,
    Sidebar,
    Product,
    Totals
  },
  mixins: [ VueOfflineMixin ],
  props: {
    isCheckoutMode: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems'
    })
  },
  methods: {
    continueShopping (toCheckout = false) {
      this.$store.dispatch('ui/closeAll')
      if (toCheckout === true) {
        this.$router.push(this.localizedRoute('/checkout'))
      }
    },
    clearCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: i18n.t('Are you sure you would like to remove all the items from the shopping cart?'),
        action1: { label: i18n.t('Cancel'), action: 'close' },
        action2: {
          label: i18n.t('OK'),
          action: async () => {
            await this.$store.dispatch('cart/clear', { sync: true })
          }
        },
        hasNoTimeout: true
      })
    }
  }
}
</script>
