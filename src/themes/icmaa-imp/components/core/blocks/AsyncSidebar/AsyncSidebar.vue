<template>
  <transition :name="direction === 'right' ? 'slide-left' : direction === 'left' ? 'slide-right' : null">
    <div
      v-if="isOpen"
      ref="sidebar"
      class="sidebar t-fixed t-max-w-90pc t-bg-white t-scrolling-touch"
      :class="[direction === 'left' ? 'left-sidebar' : direction === 'right' ? 'right-sidebar' : null, { 'wide': wide }]"
      data-test-id="Sidebar"
    >
      <div class="submenu-wrapper t-relative">
        <component
          :is="component"
          v-show="!hasSubmenu"
          :key="'sidebar-home'"
          v-bind="asyncComponentProps"
          @close="$emit('close')"
          @reload="getComponent"
        />
        <template v-for="(item, i) in sidebarPath">
          <Submenu
            v-show="i === sidebarLastIndex"
            :key="'submenu-' + i"
            :index="i"
            :async-component="item.component"
          />
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import Submenu from 'theme/components/core/blocks/AsyncSidebar/Submenu'
import LoadingSpinner from 'theme/components/core/blocks/AsyncSidebar/LoadingSpinner'
import LoadingError from 'theme/components/core/blocks/AsyncSidebar/LoadingError'
import { uiHooksExecutors } from 'theme/hooks/ui'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export default {
  name: 'AsyncSidebar',
  components: {
    Submenu
  },
  props: {
    stateKey: {
      type: String,
      required: true
    },
    asyncComponent: {
      type: Function,
      required: true
    },
    asyncComponentProps: {
      type: Object,
      default: () => {}
    },
    /** "right" or "left"  */
    direction: {
      type: String,
      default: 'right'
    },
    wide: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      component: null
    }
  },
  computed: {
    ...mapGetters({
      getSidebarStatus: 'ui/getSidebarStatus',
      sidebarPath: 'ui/getSidebarPath'
    }),
    isOpen () {
      return this.getSidebarStatus(this.stateKey)
    },
    hasSubmenu () {
      return this.sidebarPath.length > 0
    },
    sidebarLength () {
      return this.sidebarPath.length
    },
    sidebarLastIndex () {
      return this.sidebarLength - 1
    }
  },
  watch: {
    isOpen (status) {
      if (status === false) {
        this.$emit('close')
        uiHooksExecutors.sidebarClosed(this.stateKey)
      }

      this.$nextTick(() => {
        if (status) {
          disableBodyScroll(this.$refs.sidebar)
        } else {
          clearAllBodyScrollLocks()
        }
      })
    }
  },
  beforeMount () {
    this.getComponent()
  },
  mounted () {
    // Close this if browser-back button is called
    window.addEventListener('popstate', this.onHistoryBack)
  },
  destroyed () {
    window.removeEventListener('popstate', this.onHistoryBack)
  },
  methods: {
    getComponent () {
      this.component = () => ({
        component: this.asyncComponent(),
        loading: LoadingSpinner,
        error: LoadingError,
        timeout: 3000
      })
    },
    onHistoryBack () {
      this.$store.dispatch('ui/closeAll')
    }
  }
}
</script>

<style lang="scss">
@import "~theme/css/animations/transitions";
@import '~theme/css/base/global_vars';
$z-index-modal: map-get($z-index, modal);

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform .25s;
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(100%);
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(-100%);
}

.left-sidebar,
.right-sidebar {
  top: 0;
  height: 100vh;
  max-height: 100vh;
  overflow: auto;

  &.slide-left-enter-active .sidebar-menu .header,
  &.slide-left-leave-active .sidebar-menu .header,
  &.slide-right-enter-active .sidebar-menu .header,
  &.slide-right-leave-active .sidebar-menu .header {
    /** This prevents flickering of the header during the animation */
    max-width: 100% !important;
  }

  &, .sidebar-menu .header {
    z-index: $z-index-modal;
    width: 460px;
  }

  &.wide, &.wide .sidebar-menu .header {
    width: 800px;
  }

  @media (max-width: 767px) {
    width: 100vh;
  }
}

.left-sidebar{
  left: 0;
}

.right-sidebar{
  right: 0;
}

</style>
