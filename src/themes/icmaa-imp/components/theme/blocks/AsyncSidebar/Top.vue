<template>
  <div class="top t-px-2 t-bg-white t-border-b t-border-base-lighter t-flex">
    <slot />
    <div class="t-flex-expand" />
    <top-button icon="close" text="Close" tabindex="1" @click.native="closeMenu" class="t-text-base" />
  </div>
</template>

<script>
import TopButton from 'theme/components/theme/blocks/AsyncSidebar/TopButton'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'

export default {
  name: 'AsyncMenuTop',
  components: {
    TopButton
  },
  mixins: [onEscapePress],
  methods: {
    closeMenu () {
      this.$store.dispatch('ui/closeAll')
    },
    onEscapePress () {
      this.$store.dispatch('ui/closeAll')
    }
  }
}
</script>

<style lang="scss" scoped>

.top {
  height: 60px;
}

</style>
