<template>
  <div
    v-if="active"
    class="loader-overlay t-fixed t-left-0 t-top-0 t-z-50 t-flex t-h-full t-w-full t-items-center t-justify-center"
    data-test-id="Loader"
  >
    <div class="t-item-center t-flex t-flex-wrap t-justify-center">
      <div class="loader color-pulse-ball t-bg-primary" />
      <div
        v-if="message"
        class="t--mt-3 t-w-full t-max-w-screen-75 t-bg-white t-px-4 t-py-2 t-text-center t-text-sm t-text-primary"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Loader',
  computed: mapState({
    active: state => state.ui.loader.active,
    message: state => state.ui.loader.message
  })
  // This is for backwards compatibility to support the old events
  // methods: {
  //   show (message = null) {
  //     this.$store.dispatch('ui/loader', { active: true, message })
  //   },
  //   hide () {
  //     this.$store.dispatch('ui/loader', false)
  //   }
  // },
  // beforeMount () {
  //   this.$bus.$on('notification-progress-start', this.show)
  //   this.$bus.$on('notification-progress-stop', this.hide)
  // },
  // beforeDestroy () {
  //   this.$bus.$off('notification-progress-start', this.show)
  //   this.$bus.$off('notification-progress-stop', this.hide)
  // }
}
</script>

<style lang="scss" scoped>
/**
 * @source https://theanam.github.io/css-only-loaders/
 */

 .loader-overlay {
   background: rgba(255,255,255,0.75);
 }

.loader, .loader:before, .loader:after{
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
}

.loader.color-pulse-ball {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  animation: pulse 2s infinite ease;
}

@keyframes pulse {
  0%, 1% {
    opacity: 1;
    transform: scale(0.1);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

</style>
