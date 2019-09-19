<template>
  <div
    class="t-flex t-items-center t-h-12 t-px-4 t-text-base-tone t-text-sm t-uppercase t-border-base-lightest t-cursor-pointer"
    :class="[ {'t-bg-base-lightest t-text-black': isActive && isLoading}, isLast ? 't-border-b-0' : ' t-border-b']"
    @click="selectVariant"
    :aria-label="$t('Select ' + variant.label)"
  >
    {{ getOptionLabel({ attributeKey: variant.type, optionId: variant.id }) }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import filterMixin from 'theme/mixins/filterMixin.ts'
import focusClean from 'theme/components/theme/directives/focusClean'

export default {
  mixins: [ filterMixin ],
  directives: { focusClean },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('attribute', { getOptionLabel: 'getOptionLabel' })
  },
  methods: {
    selectVariant () {
      this.$emit('change', this.variant)
    }
  }
}
</script>
