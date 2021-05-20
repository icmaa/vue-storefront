<template>
  <div class="t-container" id="checkout">
    <div class="t-flex lg:t-px-4 lg:t-py-8">
      <div class="t-w-full t-p-6 t-pt-4 lg:t-w-2/5 lg:t-p-0 lg:t-py-8">
        <div class="t-flex t-items-center t-justify-between t-mb-6 lg:t-mb-8">
          <h1 class="t-flex t-items-center t-text-1xl t-font-bold">
            <span class="t-flex t-items-center t-justify-center t-w-8 t-mr-4">
              <material-icon icon="credit_card" size="lg" />
            </span>
            <span class="title">
              {{ $t('Checkout') }}
            </span>
          </h1>
          <logo width="174" height="43" class="logo t-flex-fix t--mr-6 lg:t-mr-0" />
        </div>
        <step
          v-for="(step, index) in steps"
          :key="`${step.name}-${index}`"
          :name="step.name"
          :index="index + 1"
          :title="$t(step.title)"
          :active="step.active"
          :done="step.done"
          :last="(index + 1) === steps.length"
        >
          <component
            :is="step.component"
            :active="step.active"
            :done="step.done"
          />
        </step>
      </div>
      <div class="t-hidden lg:t-block lg:t-w-3/5 t-pl-8">
        <div class="t-min-h-full t-bg-base-lightest t-p-8">
          <div>
            {{ isLoading }}
            Cart summary comes here …
            <!-- <cart-summary /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'

import Checkout from 'icmaa-checkout/pages/Checkout'
import Logo from 'theme/components/core/blocks/Header/Logo'
import Step from 'theme/components/core/blocks/Checkout/Step'
import CartSummary from 'theme/components/core/blocks/Checkout/CartSummary'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

const PersonalDetails = () => import(/* webpackChunkName: "vsf-checkout-personal-details" */ 'theme/components/core/blocks/Checkout/PersonalDetails')
const Addresses = () => import(/* webpackChunkName: "vsf-checkout-addresses" */ 'theme/components/core/blocks/Checkout/Addresses')
const Shipping = () => import(/* webpackChunkName: "vsf-checkout-shipping" */ 'theme/components/core/blocks/Checkout/Shipping')
const Payment = () => import(/* webpackChunkName: "vsf-checkout-payment" */ 'theme/components/core/blocks/Checkout/Payment')
const Review = () => import(/* webpackChunkName: "vsf-checkout-review" */ 'theme/components/core/blocks/Checkout/Review')

export default {
  name: 'Checkout',
  components: {
    Logo,
    Step,
    CartSummary,
    MaterialIcon
  },
  mixins: [ Checkout ],
  beforeCreate () {
    registerModule(OrderModule)
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn'
    }),
    steps () {
      return [
        {
          name: 'personal',
          title: this.isLoggedIn ? 'Personal Details' : 'Login / Personal Details',
          component: PersonalDetails
        },
        {
          name: 'addresses',
          title: 'Address',
          component: Addresses
        },
        {
          name: 'shipping',
          title: 'Shipping',
          component: Shipping
        },
        {
          name: 'payment',
          title: 'Payment',
          component: Payment
        },
        {
          name: 'review',
          title: 'Review',
          component: Review
        }
      ].map(step => Object.assign(step, this.sections[step.name]))
    }
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

<style lang="scss">

@media (max-width: 400px) {
  h1 > .title {
    @apply t-hidden;
  }
}

</style>
