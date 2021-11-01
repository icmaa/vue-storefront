<template>
  <layout id="cms-page" :headline="content.headline">
    <div class="t-mt-4 t-mb-8">
      {{ content.description }}
    </div>
    <div id="join-widget" />
    <script
      defer
      type="application/javascript"
      data-mount-in="#join-widget"
      :src="content.joinlink"
    />
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
