<template>
  <div
    v-if="isOverlay"
    class="t-w-10 t-h-10 lg:t-w-12 lg:t-h-12 t-bg-base-lighter t-flex t-items-center t-justify-center t-cursor-pointer"
    @click="toggleWishlist"
    data-test-id="wishlistButton"
  >
    <material-icon :icon="favoriteIcon" class="t-text-white" :class="{ 't-animation-spin t-animation-linear': loading }" />
    <span class="t-sr-only">{{ !isActive ? $t('Add to favorite') : $t('Remove') }}</span>
  </div>
  <button-component
    v-else
    :type="buttonType"
    :icon="favoriteIcon"
    :icon-only="true"
    :icon-class="loading ? 't-animation-spin t-animation-linear' : false"
    @click.native="toggleWishlist"
    data-test-id="wishlistButton"
  >
    <slot>
      {{ !isActive ? $t('Add to favorite') : $t('Remove') }}
    </slot>
  </button-component>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import ButtonComponent from 'theme/components/core/blocks/Button'
import { htmlDecode } from '@vue-storefront/core/lib/store/filters'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'

export default {
  name: 'WishlistButton',
  components: {
    MaterialIcon,
    ButtonComponent
  },
  props: {
    product: {
      required: true,
      type: Object
    },
    isOverlay: {
      type: Boolean,
      default: false
    },
    buttonType: {
      type: String,
      default: 'ghost'
    },
    iconAdd: {
      type: String,
      default: 'favorite_border'
    },
    iconRemove: {
      type: String,
      default: 'favorite'
    },
    size: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      isOnWishlist: 'wishlist/isOnWishlist'
    }),
    favoriteIcon () {
      if (this.loading === true) {
        return 'loop'
      }

      return this.isActive ? this.iconRemove : this.iconAdd
    },
    isActive () {
      return this.isOnWishlist(this.product)
    }
  },
  methods: {
    toggleWishlist () {
      return this.isActive
        ? this.wishlistAction('rmv', 'Product {productName} has been removed from wishlist!')
        : this.wishlistAction('add', 'Product {productName} has been added to wishlist!')
    },
    async wishlistAction (action, message) {
      if (this.loading) return

      const actionNameMap = { add: 'addItem', rmv: 'removeItem' }
      if (!Object.keys(actionNameMap).includes(action)) return

      this.loading = true
      await this.$store.dispatch(`wishlist/${actionNameMap[action]}`, this.product)
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: i18n.t(message, { productName: htmlDecode(this.product.name) }),
        action1: { label: i18n.t('OK') }
      }, { root: true })

      IcmaaGoogleTagManagerExecutors.wishlistInteraction({
        type: action,
        product: this.product
      })

      this.loading = false
    }
  }
}
</script>
