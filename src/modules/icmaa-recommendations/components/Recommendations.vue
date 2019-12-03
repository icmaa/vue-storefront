<template>
  <div v-if="products && products.length > 0">
    <h3 v-if="title" v-text="title" />
    <div class="t-flex t-flex-wrap t-px-2 t--mx-2">
      <product-tile v-for="(product, i) in products" :key="i" :product="product" class="t-w-1/4 t-px-2" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductTile from 'theme/components/core/ProductTile'

export default {
  name: 'IcmaaRecommendations',
  components: {
    ProductTile
  },
  props: {
    type: {
      type: String,
      default: 'crosssell'
    },
    limit: {
      type: Number,
      default: 4
    },
    title: {
      type: [String, Boolean],
      default: false
    }
  },
  computed: {
    ...mapGetters({
      currentProduct: 'product/getCurrentProduct',
      getRecommendations: 'icmaaRecommendations/getByTypeAndProductId'
    }),
    recommendations () {
      return this.getRecommendations(this.currentProduct.id, this.type)
    },
    products () {
      return this.recommendations ? this.recommendations.products : []
    }
  },
  mounted () {
    this.$store.dispatch(
      'icmaaRecommendations/single',
      { product: this.currentProduct, type: this.type, size: this.limit }
    )
  }
}
</script>
