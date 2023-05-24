<template>
  <div
    v-if="products && products.length > 0"
    data-test-id="Recommendations"
  >
    <h3
      v-if="title"
      class="t-mb-4 t-text-center t-text-sm t-uppercase t-text-base-tone"
      v-text="title"
    />
    <div class="t--mx-2 t-flex t-flex-wrap">
      <ProductTile
        v-for="(recommended, i) in products"
        :key="i"
        :product="recommended"
        class="product t-mb-8 t-w-1/2 t-cursor-pointer t-px-1 lg:t-mb-0 lg:t-w-1/4 lg:t-px-2"
      />
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
      return this.getRecommendations(this.product.id, this.type)
    },
    product () {
      return this.currentProduct
    },
    products () {
      return this.recommendations ? this.recommendations.products : []
    }
  },
  watch: {
    async product (product) {
      return this.fetchRelated()
    }
  },
  async mounted () {
    return this.fetchRelated()
  },
  methods: {
    async fetchRelated () {
      await this.$store.dispatch(
        'icmaaRecommendations/single',
        { product: this.product, type: this.type, size: this.limit }
      )
    }
  }
}
</script>
