<template>
  <component :is="htmlContent" class="t-text-sm t-leading-relaxed t-text-base-tone" />
</template>

<script>

import { stringToComponent } from 'icmaa-cms/helpers'

export default {
  name: 'RichtText',
  props: {
    content: {
      type: String,
      required: true
    },
    tagClasses: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    htmlContent () {
      return stringToComponent(this.content, { cssClasses: this.tagClasses })
    }
  }
}
</script>
