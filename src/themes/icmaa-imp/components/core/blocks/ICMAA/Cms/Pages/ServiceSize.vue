<template>
  <layout
    id="cms-page"
    :headline="content.headline"
  >
    <size-layout :content="content.headgear" />
    <size-layout :content="content.tops" />
    <size-layout :content="content.pants" />
    <shoe-layout :content="content.shoes.boys" />
    <shoe-layout :content="content.shoes.girls" />
    <h2 class="t-mt-8 t-border-b-2 t-pb-4">
      {{ content.blanks.headline }}
    </h2>
    <template v-for="(obj, index) in blanksContent">
      <shoe-layout
        :key="index"
        :content="obj"
      />
    </template>
  </layout>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'
import SizeLayout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/SizeLayout'
import ShoeLayout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/ShoeLayout'

import omit from 'lodash-es/omit'

export default {
  name: 'ServiceSize',
  components: {
    Layout,
    SizeLayout,
    ShoeLayout
  },
  mixins: [Page],
  data () {
    return {
      dataType: 'yaml'
    }
  },
  computed: {
    blanksContent () {
      return omit(this.content.blanks, ['headline'])
    }
  },
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  }
}
</script>

<style scoped>

</style>
