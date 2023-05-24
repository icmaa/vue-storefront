<template>
  <a
    :href="storeView.url"
    class="t-flex t-cursor-pointer t-items-center t-rounded-sm t-border t-border-base-lightest t-p-2 t-text-base-tone"
    :class="{ 't-bg-base-lightest': isCurrent }"
  >
    <FlagIcon
      :iso="storeView.languageCode"
      class="t-mr-2 t-flex-fix"
      format="4x3"
      width="40"
      height="30"
    />
    <div
      class="t-text-sm t-leading-none"
      v-html="storeView.name"
    />
  </a>
</template>

<script>
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
