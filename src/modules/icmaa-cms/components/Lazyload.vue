<template>
  <div v-if="(isServer && serverRendering) || inViewport">
    <slot />
  </div>
  <div class="loader" v-else>
    <slot name="loading" />
  </div>
</template>

<script>

import isVisibleMixin from 'icmaa-cms/mixins/isVisibleMixin'

export default {
  name: 'LazyloadComponent',
  mixins: [ isVisibleMixin ]
}
</script>
