<template>
  <div
    ref="container"
    class="sidebar-menu t-flex t-w-full t-flex-col"
  >
    <div class="header t-fixed t-z-1 t-flex t-h-60px t-w-full t-max-w-90pc t-flex-fix t-items-center t-border-b t-border-base-lighter t-bg-white t-px-2">
      <slot name="top" />
      <h2
        v-if="title"
        class="t-pl-2 t-text-lg t-text-base-dark"
        v-text="title"
      />
      <slot name="top-after-title" />
      <div
        v-if="useExpanderInTitle"
        class="t-flex-expand"
      />
      <slot name="top-right">
        <TopButton
          v-if="closeIcon !== false"
          data-test-id="closeButton"
          :icon="closeIcon"
          text="Close"
          :tab-index="1"
          class="t-text-base"
          @click.native="closeMenu"
        />
      </slot>
    </div>
    <div class="spacer t-h-60px" />
    <div
      class="sidebar-content t-p-4"
      @click="closeAfterClick"
    >
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'

import TopButton from 'theme/components/core/blocks/AsyncSidebar/TopButton'

export default {
  name: 'Sidebar',
  components: {
    TopButton
  },
  mixins: [ onEscapePress ],
  props: {
    title: {
      type: [Boolean, String],
      default: false
    },
    useExpanderInTitle: {
      type: Boolean,
      default: true
    },
    closeIcon: {
      type: String,
      default: 'close'
    },
    closeOnClick: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeMenu () {
      this.$store.dispatch('ui/closeAll')
      this.$emit('close')
    },
    closeAfterClick () {
      if (this.closeOnClick) {
        this.closeMenu()
      }
    },
    onEscapePress () {
      this.closeMenu()
    }
  }
}
</script>
