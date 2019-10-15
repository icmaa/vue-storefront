<template>
  <button @click="$emit('change', variant)" class="t-block" :class="{ 't-underline': isActive }" :aria-label="variant.label">
    {{ variant.label }}
  </button>
</template>

<script>
import filterMixin from 'theme/mixins/filterMixin'

export default {
  mixins: [filterMixin]
}
</script>
