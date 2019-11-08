<template>
  <div class="product-listing t-flex t-flex-wrap t-justify-start t-px-3 lg:t-px-4 lg:t--mx-2">
    <template v-for="(product, i) in products">
      <product-tile :product="product" :key="`product-${i}`" class="t-px-1 lg:t-px-2 t-mb-8" :class="['t-w-1/2 lg:t-w-1/' + columns]" />
    </template>
  </div>
</template>

<script>
import ProductTile from 'theme/components/core/ProductTile'
import { mapGetters } from 'vuex'

export default {
  name: 'ProductListingWidget',
  components: {
    ProductTile
  },
  props: {
    columns: {
      type: [Number, String],
      default: 4
    },
    limit: {
      type: [Number, String],
      default: 4
    },
    categoryId: {
      type: Number,
      required: true
    },
    sort: {
      type: String,
      default: 'created_at:asc'
    }
  },
  computed: {
    ...mapGetters('icmaaCategory', ['getProductListingWidgetByCategoryId']),
    ...mapGetters({ cluster: 'user/getCluster' }),
    products () {
      const products = this.getProductListingWidgetByCategoryId(this.categoryId)
      if (!products) {
        return []
      }
      return products.list
    }
  },
  async mounted () {
    await this.$store.dispatch('icmaaCategory/loadProductListingWidgetProducts', {
      categoryId: this.categoryId,
      cluster: this.cluster,
      size: this.limit,
      sort: this.sort
    })
  }
}
</script>
