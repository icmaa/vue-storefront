<template>
  <a :href="storeView.url" class="t-flex t-items-center t-rounded-sm t-py-2 t-px-1 t-cursor-pointer" :class="[isCurrent ? 't-bg-base-lighter' : 't-bg-base-lightest']">
    <flag-icon :iso="storeView.i18n.defaultCountry" class="t-flex-fix t-mx-1" format="4x3" width="40" height="30" />
    <div class="t-text-sm t-leading-none">{{ storeView.i18n.fullCountryName }}</div>
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
