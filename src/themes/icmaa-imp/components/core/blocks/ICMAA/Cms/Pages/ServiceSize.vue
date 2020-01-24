<template>
  <layout id="cms-page" :headline="content.headline">
    <size-layout :content="content.headgear" />
    <size-layout :content="content.tops" />
    <size-layout :content="content.pants" />
    <shoe-layout :content="content.shoes.boys" />
    <shoe-layout :content="content.shoes.girls" />
    <blank-layout :content="content.blanks" />
  </layout>
</template>

<script>
import Page from 'icmaa-cms/components/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'
import SizeLayout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/SizeLayout'
import ShoeLayout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/ShoeLayout'
import BlankLayout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/BlankLayout'

export default {
  name: 'ServiceSize',
  mixins: [Page],
  components: {
    Layout,
    SizeLayout,
    ShoeLayout,
    BlankLayout
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
