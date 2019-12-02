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
    const rules = new Rules()
  }
}
</script>
