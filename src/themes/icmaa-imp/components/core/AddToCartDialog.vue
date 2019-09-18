<template>
  <div class="sidebar-menu t-scrolling-touch t-w-full t-min-h-screen t-flex t-flex-col" ref="container">
    <top />
    <div @click="closeMenu" class="t-p-3 t-pt-4 t-flex t-flex-wrap">
      Hi
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import Top from 'theme/components/theme/blocks/AsyncSidebar/Top'

export default {
  name: 'AddToCartDialog',
  components: {
    Top
  },
  methods: {
    closeMenu () {
      this.$store.dispatch('ui/closeAll')
    }
  },
  mounted () {
    disableBodyScroll(this.$refs.container)
  },
  destroyed () {
    clearAllBodyScrollLocks()
  }
}
</script>
