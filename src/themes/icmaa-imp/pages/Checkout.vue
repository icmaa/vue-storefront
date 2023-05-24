<template>
  <div
    id="checkout"
    class="t-container"
  >
    <div class="t-flex t-justify-center lg:t-px-4 lg:t-py-8">
      <div class="t-w-full t-p-6 t-pt-4 sm:t-w-2/3 lg:t-w-1/2 lg:t-p-0 lg:t-py-8 xl:t-w-2/5">
        <div class="t-mb-6 t-flex t-items-center t-justify-between lg:t-mb-8">
          <h1 class="t-flex t-items-center t-text-1xl t-font-bold">
            <span class="t-mr-4 t-flex t-w-8 t-items-center t-justify-center">
              <material-icon
                icon="credit_card"
                size="lg"
              />
            </span>
            <span class="title">
              {{ $t('Checkout') }}
            </span>
          </h1>
          <logo
            width="174"
            height="43"
            class="logo t--mr-6 t-flex-fix lg:t-mr-0"
          />
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
            v-if="loaded"
            :active="step.active"
            :done="step.done"
          />
        </step>
      </div>
      <div class="t-hidden t-pl-8 lg:t-block lg:t-w-1/2 xl:t-w-2/5">
        <div class="t-flex t-min-h-full t-items-stretch t-bg-base-lightest t-p-4">
          <cart
            v-if="!isMobile"
            class="t-w-full t-bg-white t-p-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Checkout from 'icmaa-checkout/pages/Checkout'
import Logo from 'theme/components/core/blocks/Header/Logo'
import Step from 'theme/components/core/blocks/Checkout/Step'
import Cart from 'theme/components/core/blocks/Checkout/Cart'
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
    Cart,
    MaterialIcon
  },
  mixins: [ Checkout ],
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      viewport: 'ui/getViewport'
    }),
    steps () {
      return [
        {
          name: 'personal',
          title: this.isLoggedIn ? 'Personal Details' : 'Sign-in',
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
          title: 'Order Review',
          component: Review
        }
      ].map(step => Object.assign(step, this.sections[step.name]))
    },
    isMobile () {
      return ['xs', 'sm', 'md'].includes(this.viewport)
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
