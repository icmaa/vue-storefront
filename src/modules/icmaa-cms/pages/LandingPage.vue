<template>
  <div
    v-if="page"
    id="cms-landing-page"
    class="t-container t-p-4"
  >
    <block-wrapper :components="page.content" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import BlockWrapper from 'icmaa-cms/components/Wrapper'
import CmsMetaMixin from 'icmaa-meta/mixins/cmsMeta'

export default {
  name: 'LandingPage',
  components: {
    BlockWrapper
  },
  mixins: [ CmsMetaMixin ],
  computed: {
    ...mapGetters({
      rawLandingPages: 'icmaaCmsLandingPages/getAll'
    }),
    identifier () {
      return this.$route.params.identifier
    },
    page () {
      return this.rawLandingPages && this.rawLandingPages.find(p => p.identifier === this.identifier)
    }
  },
  async asyncData ({ store, context, route }) {
    if (context) {
      context.output.cacheTags
        .add('landingpage')
        .add('category')
        .add('product')
    }

    await store.dispatch('icmaaCmsLandingPages/single', { value: route.params.identifier })
  }
}
</script>
