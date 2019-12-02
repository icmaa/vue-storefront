<template>
  <div>
    {{ currentProduct }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
  }
}
</script>
