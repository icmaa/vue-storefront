<template>
  <no-ssr>
    <div
      v-show="OfflineOnly"
      class="t-text-md t-fixed t-bottom-0 t-left-0 t-z-1 t-w-full t-bg-alert t-p-4 t-text-white"
    >
      {{ $t('You are offline. Some features might not be available.') }}
    </div>
  </no-ssr>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import VueOfflineMixin from 'vue-offline/mixin'

export default {
  components: {
    'no-ssr': NoSSR
  },
  mixins: [VueOfflineMixin]
}
</script>
