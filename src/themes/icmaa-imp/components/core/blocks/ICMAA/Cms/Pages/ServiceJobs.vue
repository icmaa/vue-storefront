<template>
  <layout id="cms-page">
    <h2 v-html="content.headline" />
    <div class="t-mt-4 t-mb-8">
      {{ content.description }}
    </div>
    <div id="join-widget" />
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
  },
  async mounted () {
    await new Promise(resolve => {
      const script = document.createElement('script')
      script.defer = true
      script.src = this.content.joinlink
      script.setAttribute('data-mount-in', '#join-widget')
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }
}
</script>
