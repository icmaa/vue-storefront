<template>
  <sidebar :title="$t('Shopping cart')" class="microcart t-relative" data-testid="microcart" :close-on-click="false">
    <template v-slot:top-after-title>
      <button-component v-if="productsInCart.length" type="transparent" size="sm" icon="delete" :icon-only="true" @click="clearCart">
        {{ $t('Clear cart') }}
      </button-component>
    </template>

    <transition name="fade">
      <div v-if="isEditMode" class="overlay" @click="closeEditMode" />
    </transition>

    <h4 v-if="!productsInCart.length" class="cl-accent ml30">
      {{ $t('Your shopping cart is empty.') }}
    </h4>

    <ul v-if="productsInCart.length" class="">
      <product v-for="product in productsInCart" :key="product.checksum || product.sku" :product="product" />
    </ul>

    <div v-if="productsInCart.length" class="">
      <h3 class="t-text-lg t-py-4">
        {{ $t('Shopping summary') }}
      </h3>
      <div v-for="(segment, index) in totals" :key="index" class="" v-if="segment.code !== 'grand_total'">
        <div class="t-flex t-items-center t-justify-between t-py-1">
          <div class="">
            {{ segment.title }}
            <button v-if="appliedCoupon && segment.code === 'discount'" type="button" class="p0 brdr-none bg-cl-transparent close delete-button ml10" @click="clearCoupon">
              <i class="material-icons cl-accent">
                close
              </i>
            </button>
          </div>
          <div v-if="segment.value != null" class="">
            {{ segment.value | price }}
          </div>
        </div>
      </div>

      <div class="">
        <div v-if="OnlineOnly && !addCouponPressed" class="col-xs-12">
          <button class="p0 brdr-none serif fs-medium-small cl-accent bg-cl-transparent" type="button" @click="addDiscountCoupon">
            {{ $t('Add a discount code') }}
          </button>
        </div>
        <div v-if="OnlineOnly && addCouponPressed" class="col-xs-12 pt30 coupon-wrapper">
          <div class="coupon-input">
            <label class="h6 cl-secondary">{{ $t('Discount code') }}</label>
            <base-input type="text" id="couponinput" :autofocus="true" v-model.trim="couponCode" @keyup.enter="setCoupon" />
          </div>
          <button-outline color="dark" :disabled="!couponCode" @click.native="setCoupon">
            {{ $t('Add discount code') }}
          </button-outline>
        </div>
      </div>

      <div class="t-flex t-items-center t-justify-between" v-for="(segment, index) in totals" :key="index" v-if="segment.code === 'grand_total'">
        <div class="t-font-bold t-text-lg">
          {{ segment.title }}
        </div>
        <div class="t-font-bold t-text-lg">
          {{ segment.value | price }}
        </div>
      </div>
    </div>

    <div class="" v-if="productsInCart.length && !isCheckoutMode">
      <div class="t-mb-4">
        <!--<router-link :to="localizedRoute('/')" class="no-underline cl-secondary link">
          <span @click="closeMicrocartExtend">
            {{ $t('Return to shopping') }}
          </span>
        </router-link>-->
      </div>
      <div class="">
        <!-- <button-full :link="{ name: 'checkout' }" @click.native="closeMicrocartExtend">
          {{ $t('Go to checkout') }}
        </button-full>-->
        <button-component :type="'primary'" class="t-w-full t-h-16 t-text-md" :link="{ name: 'checkout' }" @click.native="closeMicrocartExtend">
          {{ $t('Go to checkout') }}
        </button-component>
        <!--<instant-checkout v-if="isInstantCheckoutRegistered" class="no-outline button-full block brdr-none w-100 px10 py20 bg-cl-mine-shaft :bg-cl-th-secondary ripple weight-400 h4 cl-white sans-serif fs-medium mt20" />-->
      </div>
    </div>
  </sidebar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import i18n from '@vue-storefront/i18n'
import { isModuleRegistered } from '@vue-storefront/core/lib/modules'

import VueOfflineMixin from 'vue-offline/mixin'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import InstantCheckout from 'src/modules/instant-checkout/components/InstantCheckout.vue'
import { registerModule } from '@vue-storefront/core/lib/modules'

import ButtonComponent from 'theme/components/core/blocks/Button'
import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ClearCartButton from 'theme/components/core/blocks/Microcart/ClearCartButton'
import ButtonFull from 'theme/components/theme/ButtonFull'
import ButtonOutline from 'theme/components/theme/ButtonOutline'
import Product from 'theme/components/core/blocks/Microcart/Product'
import EditMode from './EditMode'
import { InstantCheckoutModule } from 'src/modules/instant-checkout'

export default {
  components: {
    ButtonComponent,
    Sidebar,
    Product,
    ClearCartButton,
    ButtonFull,
    ButtonOutline,
    BaseInput,
    InstantCheckout
  },
  mixins: [VueOfflineMixin, EditMode, onEscapePress],
  data () {
    return {
      addCouponPressed: false,
      couponCode: '',
      componentLoaded: false,
      isInstantCheckoutRegistered: isModuleRegistered('InstantCheckoutModule')
    }
  },
  props: {
    isCheckoutMode: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  beforeCreate () {
    registerModule(InstantCheckoutModule)
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true
    })
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      appliedCoupon: 'cart/getCoupon',
      totals: 'cart/getTotals',
      isOpen: 'cart/getIsMicroCartOpen'
    })
  },
  methods: {
    ...mapActions({
      applyCoupon: 'cart/applyCoupon'
    }),
    addDiscountCoupon () {
      this.addCouponPressed = true
    },
    clearCoupon () {
      this.$store.dispatch('cart/removeCoupon')
      this.addCouponPressed = false
    },
    async setCoupon () {
      const couponApplied = await this.applyCoupon(this.couponCode)
      this.addCouponPressed = false
      this.couponCode = ''
      if (!couponApplied) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          message: i18n.t("You've entered an incorrect coupon code. Please try again."),
          action1: { label: i18n.t('OK') }
        })
      }
    },
    closeMicrocartExtend () {
      this.$store.dispatch('ui/closeAll')
      this.addCouponPressed = false
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

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';

.mt0 {
  @media (max-width: 767px) {
    margin-top: 0;
  }
}

.clearcart {
  &-col {
    display: flex;
    align-self: center;
  }
}

.products {
  @media (max-width: 767px) {
    padding: 30px 15px;
  }
}

.actions {
  @media (max-width: 767px) {
    padding: 0 15px;
  }
  .link {
    @media (max-width: 767px) {
      display: flex;
      justify-content: center;
      padding: 20px 70px;
      &.checkout {
        margin-top: 55px;
        padding: 0;
      }
    }
  }
}

.summary {
  @media (max-width: 767px) {
    padding: 0 15px;
    font-size: 12px;
  }
}

.summary-heading {
  @media (max-width: 767px) {
    font-size: 18px;
  }
}

.total-price-label {
  @media (max-width: 767px) {
    font-size: 18px;
  }
}

.total-price-value {
  @media (max-width: 767px) {
    font-size: 24px;
  }
}

.delete-button {
  vertical-align: middle;
}

.coupon-wrapper {
  display: flex;

  .button-outline {
    text-transform: inherit;
    width: 50%;
  }

  .coupon-input {
    margin-right: 20px;
    width: 100%;
  }
}

.overlay {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  z-index: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
