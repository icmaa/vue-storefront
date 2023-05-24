<template>
  <layout
    id="cms-page"
    :headline="content.headline"
  >
    <div class="t-mb-8 t-mt-4">
      {{ content.description }}
    </div>
    <iframe
      class="t-top-0"
      width="100%"
      height="600px"
      scrolling="yes"
      :src="content.iframesrc"
      frameborder="0"
    />
  </layout>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'

export default {
  name: 'ServiceJobs',
  components: {
    Layout
  },
  mixins: [ Page ],
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
