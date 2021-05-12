<template>
  <div class="t-container" id="checkout" v-if="!isThankYouPage">
    <div class="t-flex t-px-4 t-pt-8 t-pb-8">
      <div class="t-w-full lg:t-w-2/3 t-p-8 t-bg-white">
        <h1>
          {{ $t('Checkout') }}
        </h1>
        <step
          name="personal-details"
          :index="1"
          :title="$t('Personal Details')"
          :active="activeSection.personalDetails"
        >
          <personal-details :is-active="activeSection.personalDetails" />
        </step>
        <step
          name="shipping"
          :index="2"
          :title="$t('Shipping')"
          :active="activeSection.shipping"
        >
          <shipping :is-active="activeSection.shipping" v-if="!isVirtualCart" />
        </step>
        <step
          name="payment"
          :index="3"
          :title="$t('Payment')"
          :active="activeSection.payment"
        >
          <payment :is-active="activeSection.payment" />
        </step>
        <step
          name="review"
          :title="$t('Review') "
          :index="4"
          :active="activeSection.orderReview"
        >
          <order-review :is-active="activeSection.orderReview" />
        </step>
      </div>
      <div class="t-hidden lg:t-block lg:t-w-1/3 t-pl-8">
        Cart summary comes here …
        <!-- <cart-summary /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'

import Checkout from 'icmaa-checkout/pages/Checkout'
import Step from 'theme/components/core/blocks/Checkout/Step'
import PersonalDetails from 'theme/components/core/blocks/Checkout/PersonalDetails'
import Shipping from 'theme/components/core/blocks/Checkout/Shipping'
import Payment from 'theme/components/core/blocks/Checkout/Payment'
import OrderReview from 'theme/components/core/blocks/Checkout/OrderReview'
import CartSummary from 'theme/components/core/blocks/Checkout/CartSummary'

export default {
  name: 'Checkout',
  components: {
    Step,
    PersonalDetails,
    Shipping,
    Payment,
    OrderReview,
    CartSummary
  },
  mixins: [ Checkout ],
  beforeCreate () {
    registerModule(OrderModule)
  },
  methods: {
    notifyEmptyCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Shopping cart is empty. Please add some products before entering Checkout'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyOutStock (chp) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: chp.name + this.$t(' is out of stock!'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyNotAvailable () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t('Some of the ordered products are not available!'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyStockCheck () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Stock check in progress, please wait while available stock quantities are checked'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyNoConnection () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now.'),
        action1: { label: this.$t('OK') }
      })
    }
  }
}
</script>
