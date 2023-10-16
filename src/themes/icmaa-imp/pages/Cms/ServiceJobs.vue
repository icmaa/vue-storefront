<template>
  <Layout
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
  </Layout>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import Layout from 'theme/pages/Cms/Service/Layout'

export default {
  name: 'ServiceJobs',
  components: {
    Layout
  },
  mixins: [ Page ],
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  },
  data () {
    return {
      dataType: 'yaml'
    }
  }
}
</script>
