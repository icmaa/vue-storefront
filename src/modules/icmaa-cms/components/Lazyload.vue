<template>
  <div v-if="(isServer && serverRendering) || inViewport">
    <slot />
  </div>
  <div class="loader" v-else>
    <slot name="loading" />
  </div>
</template>

<script>

import LazyLoadMixin from 'icmaa-cms/mixins/LazyLoadMixin'

export default {
  name: 'LazyloadComponent',
  mixins: [ LazyLoadMixin ]
}
</script>
