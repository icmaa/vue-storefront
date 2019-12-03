<template>
  <div>
    THIS IS WHERE THE RECS COME
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Rules from 'icmaa-recommendations/helpers/Rules.ts'

export default {
  name: 'IcmaaRecommendations',
  props: {
    limit: {
      type: Number,
      default: 4
    }
  },
  computed: {
    ...mapGetters({ currentProduct: 'product/getCurrentProduct' })
  },
  mounted () {
    const rules = new Rules(this.currentProduct, 'crosssell')
    const query = rules.getSearchQuery()

    query.rawOption('_source', ['name', 'customercluster', 'department', 'gender'])
    query.size(this.limit)

    console.log(JSON.stringify(query.build()))
  }
}
</script>
