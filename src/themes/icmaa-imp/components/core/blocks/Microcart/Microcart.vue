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
          <product v-for="product in productsInCart" :key="product.checksum || product.sku" :product="product" />
        </ul>
        <div class="t-mb-4">
          <div v-for="(segment, index) in filteredTotals" :key="`total-${index}`" class="t-flex t-items-center t-justify-between t-mb-2 t-text-sm">
            <span>
              {{ segment.title }}
            </span>
            <span v-if="segment.value !== null">
              {{ segment.value_incl_tax || segment.value | price }}
            </span>
          </div>
          <div class="t-flex t-items-center t-justify-between t-font-bold" v-for="(segment, index) in grandTotals" :key="`grand-total-${index}`">
            <span>
              {{ segment.title }}
            </span>
            <span>
              {{ segment.value | price }}
            </span>
          </div>
        </div>

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
import Coupon from 'theme/components/core/blocks/Microcart/Coupon'

export default {
  name: 'MicroCart',
  components: {
    ButtonComponent,
    Coupon,
    Sidebar,
    Product
  },
  mixins: [VueOfflineMixin],
  data () {
    return {
      componentLoaded: false
    }
  },
  props: {
    isCheckoutMode: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true
    })
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      totals: 'cart/getTotals'
    }),
    filteredTotals () {
      return this.totals.filter(segment => segment.code !== 'grand_total')
    },
    grandTotals () {
      return this.totals.filter(segment => segment.code === 'grand_total')
    }
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
            await this.$store.dispatch('cart/clear')
            await this.$store.dispatch('cart/sync', { forceClientState: true })
          }
        },
        hasNoTimeout: true
      })
    }
  }
}
</script>
