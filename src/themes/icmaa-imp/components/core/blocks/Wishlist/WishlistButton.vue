<template>
  <div
    v-if="isOverlay"
    class="t-flex t-h-10 t-w-10 t-cursor-pointer t-items-center t-justify-center t-bg-base-lighter lg:t-h-12 lg:t-w-12"
    data-test-id="wishlistButton"
    @click="toggleWishlist"
  >
    <MaterialIcon
      :icon="favoriteIcon"
      class="t-text-white"
      :class="{ 't-animate-spin': loading }"
    />
    <span class="t-sr-only">{{ !isActive ? $t('Add to favorite') : $t('Remove') }}</span>
  </div>
  <ButtonComponent
    v-else
    :type="buttonType"
    :icon="favoriteIcon"
    :icon-only="true"
    :icon-class="loading ? 't-animate-spin' : false"
    data-test-id="wishlistButton"
    @click.native="toggleWishlist"
  >
    <slot>
      {{ !isActive ? $t('Add to favorite') : $t('Remove') }}
    </slot>
  </ButtonComponent>
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
        message: i18n.t(message, { productName: htmlDecode(this.product.translatedName) }),
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
