<template>
  <div
    data-test-id="ProductListingWidget"
    class="product-listing t-flex t-flex-wrap t-justify-start lg:t--mx-2"
    :class="[ appearance ] "
  >
    <template v-for="(product) in products">
      <product-tile
        :key="`product-${product.sku}`"
        :product="product"
        class="t-mb-8 t-px-1 lg:t-px-2"
        :class="['t-w-1/2 lg:t-w-1/' + columns]"
      />
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
    ...mapGetters({
      cluster: 'user/getCluster',
      getUserSessionData: 'user/getSessionData'
    }),
    options () {
      return {
        categoryId: this.categoryId,
        filter: this.filter,
        sort: this.sort,
        size: this.limit
      }
    },
    products () {
      const products = this.getProductListingWidget(this.options)
      if (!products) return []
      return products.list.slice(0, this.limit)
    },
    gender () {
      return this.getUserSessionData('gender')
    }
  },
  watch: {
    cluster () {
      this.fetchProducts(true)
    },
    gender () {
      this.fetchProducts(true)
    }
  },
  mounted () {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts (reload = false) {
      await this.$store.dispatch(
        'icmaaCategory/loadProductListingWidgetProducts',
        { ...this.options, reload }
      )
    }
  }
}
</script>
