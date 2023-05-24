<template>
  <div v-if="(isServer && serverRendering) || inViewport">
    <slot />
  </div>
  <div
    v-else
    class="loader"
    :data-test-id="dataTestId"
  >
    <slot name="loading" />
  </div>
</template>

<script>

import LazyLoadMixin from 'icmaa-cms/mixins/LazyloadMixin'

export default {
  name: 'LazyloadComponent',
  mixins: [ LazyLoadMixin ],
  props: {
    dataTestId: {
      type: String,
      default: undefined
    }
  }
}
</script>
