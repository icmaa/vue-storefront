<template>
  <pre>
    {{ query }}
  </pre>
</template>

<script>
import { mapGetters } from 'vuex'
import Rules from 'icmaa-recommendations/helpers/Rules.ts'

export default {
  name: 'IcmaaRecommendations',
  props: {
    type: {
      type: String,
      default: 'crosssell'
    },
    limit: {
      type: Number,
      default: 4
    }
  },
  computed: {
    ...mapGetters({ currentProduct: 'product/getCurrentProduct' }),
    query () {
      const rules = new Rules(this.currentProduct, this.type)
      const query = rules.getSearchQuery()

      query.size(this.limit)

      return query.build()
    }
  },
  mounted () {
    // Load products by bodybuilder query
  }
}
</script>
