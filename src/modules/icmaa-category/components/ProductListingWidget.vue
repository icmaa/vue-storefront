<template>
  <div data-test-id="ProductListingWidget" class="product-listing t-flex t-flex-wrap t-justify-start lg:t--mx-2" :class="[ appearance ] ">
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
    filter: {
      type: [Object, Boolean],
      required: false,
      default: false
    },
    sort: {
      type: String,
      default: 'online:desc'
    },
    appearance: {
      type: String,
      default: 't-px-3 lg:t-px-4'
    }
  },
  computed: {
    ...mapGetters('icmaaCategory', ['getProductListingWidget']),
    ...mapGetters({ cluster: 'user/getCluster' }),
    products () {
      const products = this.getProductListingWidget(this.categoryId, this.filter)
      if (!products) {
        return []
      }
      return products.list.slice(0, this.limit)
    }
  },
  methods: {
    async fetchProducts () {
      let size = this.limit

      // If products are not enough because of different limit than product count in state, load more.
      if (this.products.length < this.limit) {
        size = this.limit - this.products.length
      }

      await this.$store.dispatch('icmaaCategory/loadProductListingWidgetProducts', {
        categoryId: this.categoryId,
        cluster: this.cluster,
        filter: this.filter,
        sort: this.sort,
        size
      })
    }
  },
  watch: {
    cluster (a, b) {
      this.fetchProducts()
    }
  },
  mounted () {
    this.fetchProducts()
  }
}
</script>