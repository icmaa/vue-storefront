<template>
  <div class="t-mb-2 t-flex t-w-1/3 t-max-w-1/2 t-grow t-px-1">
    <GenericSelector
      v-bind="$props"
      class="t-w-full"
      v-on="$listeners"
    >
      {{ option.label }}
    </GenericSelector>
  </div>
</template>

<script>
import filterMixin from 'theme/mixins/filterMixin'
import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector'

export default {
  name: 'GenderSelector',
  components: {
    GenericSelector
  },
  mixins: [filterMixin]
}
</script>
