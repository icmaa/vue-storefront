<template>
  <a :href="storeView.url" class="t-flex t-items-center t-rounded-sm t-border t-border-base-lightest t-p-2 t-cursor-pointer t-text-base-tone" :class="{ 't-bg-base-lightest': isCurrent }">
    <flag-icon :iso="storeView.languageCode" class="t-flex-fix t-mr-2" format="4x3" width="40" height="30" />
    <div class="t-text-sm t-leading-none" v-html="storeView.name" />
  </a>
</template>

<script>
import config from 'config'
import FlagIcon from 'theme/components/core/blocks/FlagIcon'

export default {
  components: {
    FlagIcon
  },
  props: {
    storeView: {
      type: Object,
      required: true
    },
    isCurrent: {
      type: Boolean,
      required: true
    }
  }
}
</script>
