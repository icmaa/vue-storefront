<template>
  <sidebar :title="$t('Wishlist')" class="t-bg-base-lightest">
    <div class="">
      <!--<clear-wishlist-button v-if="productsInWishlist.length" @click="clearWishlist" class="col-xs-12 col-sm mb35 end-sm" />-->
      <h4 v-if="!productsInWishlist.length" class="">
        {{ $t('Your wishlist is empty.') }}
      </h4>
      <div v-if="!productsInWishlist.length" class="">
        {{ $t("Don't hesitate and") }}
        <router-link :to="localizedRoute('/')">
          {{ $t('browse our catalog') }}
        </router-link>
        {{ $t('to find something beautiful for You!') }}
      </div>
      <div class="t-container">
        <ul>
          <product v-for="wishlistProduct in productsInWishlist" :key="wishlistProduct.id" :product="wishlistProduct" />
        </ul>
      </div>
    </div>
  </sidebar>
</template>

<script>
import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import Wishlist from '@vue-storefront/core/compatibility/components/blocks/Wishlist/Wishlist'
import Product from 'theme/components/core/blocks/Wishlist/Product'

export default {
  components: {
    Sidebar,
    Product
  },
  props: {
    product: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  methods: {
    clearWishlist () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Are you sure you would like to remove all the items from the wishlist?'),
        action1: {
          label: this.$t('OK'),
          action: () => {
            this.$store.dispatch('wishlist/clear')
          }
        },
        action2: { label: this.$t('Cancel'), action: 'close' },
        hasNoTimeout: true
      })
    }
  },
  mixins: [Wishlist]
}
</script>
