<template>
  <button-icon icon="shopping_cart" title="Shopping cart" :qty="quantity" @click="toggleMicrocart" :last="last" />
</template>

<script>
import { mapGetters } from 'vuex'
import { syncCartWhenLocalStorageChange } from '@vue-storefront/core/modules/cart/helpers'
import ButtonIcon from 'theme/components/core/blocks/Header/ButtonIcon'

export default {
  name: 'ButtonCart',
  components: {
    ButtonIcon
  },
  props: {
    last: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleMicrocart () {
      this.$store.dispatch('ui/setSidebar', { key: 'microcart' })
    }
  },
  computed: {
    ...mapGetters({
      quantity: 'cart/getItemsTotalQuantity'
    })
  },
  mounted () {
    syncCartWhenLocalStorageChange.addEventListener()
    this.$once('hook:beforeDestroy', () => {
      syncCartWhenLocalStorageChange.removeEventListener()
    })
  }
}
</script>
