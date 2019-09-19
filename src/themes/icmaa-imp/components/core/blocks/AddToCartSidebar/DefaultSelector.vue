<template>
  <div
    class="t-flex t-items-center t-h-12 t-px-4 t-text-base-tone t-text-sm t-uppercase t-border-b t-border-base-lightest t-cursor-pointer"
    :class="{'active': isActive}"
    @click="$emit('change', variant)"
    :aria-label="$t('Select ' + variant.label)"
  >
    {{ variant.label }}
  </div>
</template>

<script>
import filterMixin from 'theme/mixins/filterMixin.ts'
import focusClean from 'theme/components/theme/directives/focusClean'

export default {
  mixins: [ filterMixin ],
  directives: { focusClean }
}
</script>
