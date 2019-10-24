<template>
  <sidebar :title="$t('Shopping cart')" class="microcart t-relative" data-testid="microcart" :close-on-click="false">
    <template v-slot:top-after-title>
      <button-component v-if="productsInCart.length" type="transparent" size="sm" icon="delete" :icon-only="true" @click="clearCart">
        {{ $t('Clear cart') }}
      </button-component>
    </template>

    <h4 v-if="!productsInCart.length" class="">
      {{ $t('Your shopping cart is empty.') }}
    </h4>

    <ul v-if="productsInCart.length" class="t-mb-4">
      <product v-for="product in productsInCart" :key="product.checksum || product.sku" :product="product" />
    </ul>

    <div v-if="productsInCart.length" class="t-mb-4">
      <div v-for="(segment, index) in totals" :key="index" v-if="segment.code !== 'grand_total'" class="t-flex t-items-center t-justify-between t-text-sm">
        <span>
          {{ segment.title }}
        </span>
        <span v-if="segment.value != null">
          {{ segment.value | price }}
        </span>
      </div>

      <div class="t-flex t-items-center t-justify-between t-font-bold t-text-lg t-mt-1" v-for="(segment, index) in totals" :key="index" v-if="segment.code === 'grand_total'">
        <span>
          {{ segment.title }}
        </span>
        <span>
          {{ segment.value | price }}
        </span>
      </div>
    </div>

    <template v-if="productsInCart.length && !isCheckoutMode">
      <button-component type="primary" class="t-w-full t-h-16 t-text-lg t-mb-2" :link="{ name: 'checkout' }" @click.native="closeMicrocartExtend">
        {{ $t('Go to checkout') }}
      </button-component>
      <button-component type="transparent" class="t-w-full t-h-16 t-text-sm t-text-base-light" :link="localizedRoute('/')" @click.native="closeMicrocartExtend">
        {{ $t('Return to shopping') }}
      </button-component>
    </template>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import VueOfflineMixin from 'vue-offline/mixin'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import ButtonComponent from 'theme/components/core/blocks/Button'
import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import Product from 'theme/components/core/blocks/Microcart/Product'

export default {
  components: {
    ButtonComponent,
    Sidebar,
    Product
  },
  mixins: [VueOfflineMixin, onEscapePress],
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
    })
  },
  methods: {
    closeMicrocartExtend () {
      this.$store.dispatch('ui/closeAll')
    },
    onEscapePress () {
      this.closeMicrocartExtend()
    },
    clearCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: i18n.t('Are you sure you would like to remove all the items from the shopping cart?'),
        action1: { label: i18n.t('Cancel'), action: 'close' },
        action2: {
          label: i18n.t('OK'),
          action: async () => {
            await this.$store.dispatch('cart/clear', { recreateAndSyncCart: false }) // just clear the items without sync
            await this.$store.dispatch('cart/sync', { forceClientState: true })
          }
        },
        hasNoTimeout: true
      })
    }
  }
}
</script>
