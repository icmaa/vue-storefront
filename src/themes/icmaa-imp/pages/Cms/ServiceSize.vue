<template>
  <Layout
    id="cms-page"
    :headline="content.headline"
  >
    <SizeLayout :content="content.headgear" />
    <SizeLayout :content="content.tops" />
    <SizeLayout :content="content.pants" />
    <ShoeLayout :content="content.shoes.boys" />
    <ShoeLayout :content="content.shoes.girls" />
    <h2 class="t-mt-8 t-border-b-2 t-pb-4">
      {{ content.blanks.headline }}
    </h2>
    <template v-for="(obj, index) in blanksContent">
      <ShoeLayout
        :key="index"
        :content="obj"
      />
    </template>
  </Layout>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import Layout from 'theme/pages/Cms/Service/Layout'
import SizeLayout from 'theme/pages/Cms/Service/Size/SizeLayout'
import ShoeLayout from 'theme/pages/Cms/Service/Size/ShoeLayout'

import omit from 'lodash-es/omit'

export default {
  name: 'ServiceSize',
  components: {
    Layout,
    SizeLayout,
    ShoeLayout
  },
  mixins: [Page],
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  },
  data () {
    return {
      dataType: 'yaml'
    }
  },
  computed: {
    blanksContent () {
      return omit(this.content.blanks, ['headline'])
    }
  }
}
</script>

<style scoped>

</style>
