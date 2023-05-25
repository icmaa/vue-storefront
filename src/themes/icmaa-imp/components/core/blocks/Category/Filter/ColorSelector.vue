<template>
  <button
    class="t-mb-2 t-mr-4 t-flex t-h-10 t-w-10 t-items-center t-justify-center t-rounded-full t-border t-border-base-lighter hover:t-border-base-tone"
    :aria-label="option.label"
    :style="colorFrom(option)"
    @click="$emit('change', option)"
  >
    <span class="t-sr-only">{{ option.label }}</span>
    <MaterialIcon
      v-if="isActive"
      icon="check"
      size="sm"
      class="t-rounded-full t-bg-white t-p-1"
    />
  </button>
</template>

<script>
import config from 'config'
import filterMixin from 'theme/mixins/filterMixin'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'ColorSelector',
  components: {
    MaterialIcon
  },
  mixins: [ filterMixin ],
  methods: {
    colorFrom (option) {
      if (config.products.colorMappings && typeof config.products.colorMappings[option.id] !== 'undefined') {
        return 'background: ' + config.products.colorMappings[option.id]
      }
      return ''
    }
  }
}
</script>
