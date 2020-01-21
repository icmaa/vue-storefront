<template>
  <layout id="cms-page" :headline="content.headline">
    <size-layout :content="content.headgear" />
    <size-layout :content="content.tops" />
    <size-layout :content="content.pants" />
    <shoe-size-layout :content="content.shoes.boys" />
    <shoe-size-layout :content="content.shoes.girls" />
  </layout>
</template>

<script>
import Page from 'icmaa-cms/components/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'
import SizeLayout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/SizeLayout'
import ShoeSizeLayout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/ShoeSizeLayout'

export default {
  name: 'Size',
  mixins: [Page],
  components: {
    Layout,
    SizeLayout,
    ShoeSizeLayout
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

<style scoped>

</style>
