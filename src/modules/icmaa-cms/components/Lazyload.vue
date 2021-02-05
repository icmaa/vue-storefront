<template>
  <div v-if="(isServer && serverRendering) || inViewport">
    <slot />
  </div>
  <div class="loader" :data-test-id="dataTestId" v-else>
    <slot name="loading" />
  </div>
</template>

<script>

import LazyLoadMixin from 'icmaa-cms/mixins/LazyloadMixin'

export default {
  name: 'LazyloadComponent',
  props: {
    dataTestId: {
      type: String,
      default: undefined
    }
  },
  mixins: [ LazyLoadMixin ]
}
</script>
