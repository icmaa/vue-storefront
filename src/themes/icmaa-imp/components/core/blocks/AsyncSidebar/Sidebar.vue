<template>
  <div class="sidebar-menu t-w-full t-flex t-flex-col" ref="container">
    <div class="header t-fixed t-z-1 t-w-full t-max-w-90pc t-h-60px t-flex-fix t-px-2 t-bg-white t-border-b t-border-base-lighter t-flex t-items-center">
      <slot name="top" />
      <h2 class="t-pl-2 t-text-lg t-text-base-dark" v-if="title" v-text="title" />
      <slot name="top-after-title" />
      <div class="t-flex-expand" v-if="useExpanderInTitle" />
      <slot name="top-right">
        <top-button data-test-id="closeButton" :icon="closeIcon" text="Close" :tab-index="1" @click.native="closeMenu" class="t-text-base" v-if="closeIcon !== false" />
      </slot>
    </div>
    <div class="spacer t-h-60px" />
    <div @click="closeAfterClick" class="sidebar-content t-p-4">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'

import TopButton from 'theme/components/core/blocks/AsyncSidebar/TopButton'

export default {
  name: 'Sidebar',
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
  components: {
    TopButton
  },
  mixins: [ onEscapePress ],
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
