<template>
  <navigation
    class="customer-account t--mx-4 t--mt-4 t-flex"
    @click="close"
  />
</template>

<script>

import Navigation from 'theme/components/core/blocks/MyAccount/Navigation'

export default {
  name: 'UserNavigationSidebar',
  components: {
    Navigation
  },
  methods: {
    close () {
      this.$store.dispatch('ui/closeAll')
    }
  }
}
</script>
