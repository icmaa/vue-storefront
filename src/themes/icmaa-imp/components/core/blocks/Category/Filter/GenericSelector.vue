<template>
  <button-component @click="$emit('change', variant)" :type="isActive ? 'second' : 'tag'" :aria-label="variant.label">
    {{ variant.label }}
  </button-component>
</template>

<script>
import filterMixin from 'theme/mixins/filterMixin'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    ButtonComponent
  },
  mixins: [filterMixin]
}
</script>
