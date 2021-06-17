<template>
  <sidebar :title="$t('Wishlist')" :close-on-click="true">
    <template v-slot:top-after-title>
      <button-component v-if="items.length" type="transparent" size="sm" icon="delete" :icon-only="true" @click="clearWishlist">
        {{ $t('Clear wishlist') }}
      </button-component>
    </template>
    <div class="t-pb-24" v-if="!loading">
      <h4 v-if="!items.length" class="t-text-sm">
        {{ $t('Your wishlist is empty.') }}
      </h4>
      <div class="t-container" v-else>
        <ul>
          <product v-for="(item, i) in items" :key="item.id" :product="item.product" :class="{ 't-border-b': items.length !== (i + 1) }" />
        </ul>
      </div>
    </div>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from 'theme/components/core/blocks/AsyncSidebar/Sidebar'
import Product from 'theme/components/core/blocks/Wishlist/Product'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    ButtonComponent,
    Sidebar,
    Product
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      'items': 'wishlist/getWishlistItemsWithProduct'
    })
  },
  methods: {
    clearWishlist () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Are you sure you would like to remove all the items from the wishlist?'),
        action1: {
          label: this.$t('OK'),
          action: () => this.$store.dispatch('wishlist/clear')
        },
        action2: { label: this.$t('Cancel'), action: 'close' },
        hasNoTimeout: true
      })
    }
  },
  async mounted () {
    this.loading = true
    await this.$store.dispatch('wishlist/getProducts')
    this.loading = false
  }
}
</script>
