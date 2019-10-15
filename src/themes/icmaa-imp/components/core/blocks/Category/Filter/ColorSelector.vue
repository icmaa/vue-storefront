<template>
  <button class="t-flex t-items-center t-justify-center t-border t-border-base-lighter t-rounded-full t-w-10 t-h-10 t-mr-4 t-mb-4 hover:t-border-base-tone" :class="[isActive ? '' : '']" @click="$emit('change', variant)" :aria-label="variant.label" :style="colorFrom(variant)">
    <span class="t-sr-only">{{ variant.label }}</span>
    <material-icon icon="check" size="sm" class="t-bg-white t-rounded-full t-p-1" v-if="isActive" />
  </button>
</template>

<script>
import config from 'config'
import filterMixin from 'theme/mixins/filterMixin.ts'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  mixins: [ filterMixin ],
  components: {
    MaterialIcon
  },
  methods: {
    colorFrom (variant) {
      if (config.products.colorMappings && typeof config.products.colorMappings[variant.id] !== 'undefined') {
        return 'background: ' + config.products.colorMappings[variant.id]
      }
      return ''
    }
  }
}
</script>
