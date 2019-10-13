<template>
  <div class="product-listing t-flex t-flex-wrap t-justify-start t-px-3 lg:t-px-4 lg:t--mx-2">
    <product-tile v-for="(product, key) in products" :key="`${key}-${product.id}`" :product="product" class="t-px-1 lg:t-px-2 t-mb-8" :class="[ viewport === 'sm' ? 't-w-1/2' : 't-w-1/' + columns ]" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductTile from 'theme/components/core/ProductTile'

export default {
  name: 'ProductListing',
  components: {
    ProductTile
  },
  props: {
    products: {
      type: null,
      required: true
    },
    columns: {
      type: [Number, String],
      default: 4
    }
  },
  computed: {
    ...mapGetters({ viewport: 'ui/getViewport' })
  }
}
</script>
