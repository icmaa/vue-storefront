<template>
  <div id="cms-page" class="t-container t-p-4" v-if="page">
    <component :is="content" />
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'

export default {
  name: 'Page',
  mixins: [ Page ],
  props: {
    dataType: {
      type: String,
      default: 'html'
    }
  }
}
</script>
