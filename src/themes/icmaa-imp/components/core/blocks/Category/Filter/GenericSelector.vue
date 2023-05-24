<template>
  <ButtonComponent
    :type="isActive ? 'tag-active' : 'tag'"
    :aria-label="option.label"
    @click="$emit('change', option)"
  >
    {{ option.label }}
  </ButtonComponent>
</template>

<script>
import filterMixin from 'theme/mixins/filterMixin'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'GenericSelector',
  components: {
    ButtonComponent
  },
  mixins: [filterMixin]
}
</script>
