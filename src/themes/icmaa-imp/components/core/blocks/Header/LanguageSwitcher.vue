<template>
  <div class="t-hidden t-items-stretch t-border-l t-border-base-tone sm:t-flex">
    <div
      class="t-flex t-cursor-pointer t-items-center  t-px-4"
      @click="showLanguagesModal"
    >
      <flag-icon
        :iso="languageCode"
        width="20"
        height="20"
        class="t-flex t-h-6 t-w-6 t-rounded-full t-border t-border-base-tone"
      />
    </div>
  </div>
</template>

<script>
import FlagIcon from 'theme/components/core/blocks/FlagIcon'
import FlagMixin from 'theme/mixins/flagMixin'

export default {
  components: {
    FlagIcon
  },
  mixins: [ FlagMixin ],
  methods: {
    showLanguagesModal () {
      this.$store.dispatch('ui/showModalImmediately', 'modal-switcher')
    }
  }
}
</script>
