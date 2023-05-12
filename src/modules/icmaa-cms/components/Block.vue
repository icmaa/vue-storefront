<template>
  <component
    :is="content"
    v-if="loaded && isValidComponent"
    :class="['cms-content']"
  />
</template>

<script>
import Block from 'icmaa-cms/mixins/Block'

export default {
  name: 'IcmaaCmsBlock',
  mixins: [ Block ]
}
</script>

<style lang="scss">

.cms-content {
  p, ul, ol, blockquote {
    &:not(:last-child) {
      @apply t-mb-4;
    }
  }
}

</style>
