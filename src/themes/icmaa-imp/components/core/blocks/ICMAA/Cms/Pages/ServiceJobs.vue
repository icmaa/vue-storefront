<template>
  <layout id="cms-page" :headline="content.headline">
    <div class="t-mt-4 t-mb-8">
      {{ content.description }}
    </div>
    <iframe class="t-top-0" width="100%" height="600px" scrolling="yes" :src="content.iframesrc" frameborder="0" />
  </layout>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'

export default {
  name: 'ServiceJobs',
  mixins: [ Page ],
  components: {
    Layout
  },
  data () {
    return {
      dataType: 'yaml'
    }
  },
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  }
}
</script>
