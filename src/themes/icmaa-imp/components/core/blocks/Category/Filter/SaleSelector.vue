<template>
  <ButtonComponent
    type="sale"
    :icon="isActive ? 'check' : 'local_offer'"
    icon-position="left"
    :aria-label="option.label"
    @click="$emit('change', option)"
  >
    {{ $t('In sale') }}
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
