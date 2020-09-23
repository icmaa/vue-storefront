<template>
  <div class="t-hidden sm:t-flex t-border-l t-border-base-tone t-items-stretch">
    <div class="t-flex t-items-center t-cursor-pointer  t-px-4" @click="showLanguagesModal">
      <flag-icon :iso="languageCode" width="20" height="20" class="t-flex t-w-6 t-h-6 t-rounded-full t-border t-border-base-tone" />
    </div>
  </div>
</template>

<script>
import FlagIcon from 'theme/components/core/blocks/FlagIcon'
import FlagMixin from 'theme/mixins/flagMixin'

export default {
  mixins: [ FlagMixin ],
  components: {
    FlagIcon
  },
  methods: {
    showLanguagesModal () {
      this.$bus.$emit('modal-toggle-switcher')
    }
  }
}
</script>
