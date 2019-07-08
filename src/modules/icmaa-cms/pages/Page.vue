<template>
  <div id="cms-page" v-if="page">
    <component :is="{template: content}" />
  </div>
</template>

<script>
import Page from 'src/modules/icmaa-cms/components/Page'

export default {
  mixins: [ Page ],
  computed: {
    content () {
      return `<div>${this.page.content}</div>`
    },
    css () {
      return `${this.page.css}`
    }
  }
}
</script>
