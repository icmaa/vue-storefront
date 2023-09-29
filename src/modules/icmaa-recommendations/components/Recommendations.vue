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
        v-for="reco in products"
        :key="[eventType, servingConfigs, reco.id].join('-')"
        :product="reco"
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
    eventType: {
      type: String,
      default: 'detail-page-view'
    },
    servingConfigs: {
      type: String,
      default: 'recommended-for-you'
    },
    filter: {
      type: String,
      default: ''
    },
    useCurrentProduct: {
      type: Boolean,
      default: true
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
      getRecommendations: 'icmaaRecommendations/getByTypeAndProductId',
      visitorId: 'icmaaRecommendations/getGAVisitorId'
    }),
    recommendations () {
      return this.getRecommendations(this.product?.id || null, this.eventType, this.servingConfigs, this.filter)
    },
    product () {
      return this.useCurrentProduct ? this.currentProduct || null : null
    },
    products () {
      return this.recommendations ? this.recommendations.products : []
    }
  },
  watch: {
    async product () {
      return this.fetchRelated()
    },
    async filter () {
      return this.fetchRelated()
    }
  },
  async mounted () {
    return this.fetchRelated()
  },
  methods: {
    async fetchRelated () {
      if (!!this.useCurrentProduct && !this.product?.id) return
      await this.$store.dispatch(
        'icmaaRecommendations/single',
        {
          eventType: this.eventType,
          servingConfigs: this.servingConfigs,
          product: this.product,
          size: this.limit,
          filter: this.filter
        }
      )
    }
  }
}
</script>
