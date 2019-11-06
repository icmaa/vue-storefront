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
      default: 3278 // category new
    },
    sort: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      getProductListingWidget: 'icmaaCategory/productListingWidget'
    }),
    products () {
      const products = this.getProductListingWidget;
      console.log(products)
      return products
    }
  },
  async mounted () {
    const products = await this.$store.dispatch('icmaaCategory/loadProductListingWidgetProducts', {
      categoryId: this.categoryId,
      size: this.limit,
      sort: this.sort
    })
    console.log(products)
  }
}
</script>
