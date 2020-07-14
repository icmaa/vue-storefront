<template>
  <transition name="fade-in-down">
    <div class="modal" v-if="visible" data-test-id="Modal">
      <div class="modal-backdrop" @click="close" />
      <div class="modal-container t-bg-white t-scrolling-touch sm:t-pb-0" :class="[ compact ? 'compact' : 't-pb-20' ]" ref="modal-container" :style="style">
        <div class="t-h-60px t-flex-fix t-px-4 t-bg-white t-border-b t-border-base-lighter t-flex t-items-center">
          <slot name="header-before" />
          <h2 class="t-text-lg t-text-base-dark" v-if="title" v-text="title" />
          <slot name="header" />
          <div class="t-flex-expand" />
          <top-button icon="close" text="Close" :tab-index="1" @click.native="close" data-test-id="ModalClose" class="t--mr-2 t-text-base" v-if="showCloseButton" />
        </div>
        <div class="modal-content" :class="[ padding ]">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import { mapMutations, mapGetters } from 'vuex'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

import TopButton from 'theme/components/core/blocks/AsyncSidebar/TopButton'

export default {
  name: 'Modal',
  mixins: [onEscapePress],
  components: {
    TopButton
  },
  props: {
    name: {
      required: true,
      type: String
    },
    title: {
      type: [Boolean, String],
      default: false
    },
    width: {
      type: Number,
      default: 0
    },
    padding: {
      type: String,
      default: 't-p-4 lg:t-p-8'
    },
    compact: {
      type: Boolean,
      default: false
    },
    showCloseButton: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      isModalVisible: 'ui/isModalVisible'
    }),
    visible () {
      const visible = this.isModalVisible(this.name)
      return visible
    },
    style () {
      return this.width ? `width: ${this.width}px` : false
    }
  },
  watch: {
    visible (state) {
      if (state) {
        this.$nextTick(() => {
          disableBodyScroll(this.$refs['modal-container'])
        })
      } else {
        clearAllBodyScrollLocks()
      }
    }
  },
  methods: {
    ...mapMutations('ui', ['setOverlay']),
    close () {
      this.$store.dispatch('ui/hideModal', this.name)
      this.$emit('close', this)
    },
    onEscapePress () {
      this.close()
    },
    onHistoryBack () {
      this.close()
    }
  },
  mounted () {
    // Close this if browser-back button is called
    window.addEventListener('popstate', this.onHistoryBack)
  },
  beforeDestroy () {
    window.removeEventListener('popstate', this.onHistoryBack)
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/base/global_vars';
$z-index-modal: map-get($z-index, modal);

.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  z-index: $z-index-modal;

  /** Vertical-/Horizontal-Center */
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;

  .modal-container {
    width: 945px;
    margin: 0 auto;
    max-width: 100vw;
    max-height: 100vh;
    z-index: $z-index-modal + 1;
    overflow: auto;

    @media (max-width: 600px) {
      /**
       * Fix viewport vh bug in mobile browsers
       * @see https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
       */
      min-height: 100vh;
      min-height: calc(var(--vh, 1vh) * 100);
      max-height: calc(var(--vh, 1vh) * 100);
      min-width: 100vw;
      margin: 0;

      &.compact {
        min-height: auto;
        max-height: calc(var(--vh, 1vh) * 95);
        min-width: 90vw;
        max-width: 90vw;
      }
    }
  }

  .modal-backdrop{
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    height: 100%;
  }
}
</style>
