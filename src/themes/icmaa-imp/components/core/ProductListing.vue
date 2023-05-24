<template>
  <div
    data-test-id="ProductListing"
    class="product-listing t-flex t-flex-wrap t-justify-start t-px-3 lg:t--mx-2 lg:t-px-4"
  >
    <template v-for="(product, i) in products">
      <ProductTile
        :key="`product-${i}-${product.sku}`"
        :product="product"
        :show-add-to-cart="showAddToCart"
        class="t-mb-8 t-px-1 lg:t-px-2"
        :class="[ 't-w-1/2 lg:t-w-1/' + columns ]"
      />
      <ListBanner
        v-if="i === 7 || i%28 === 27"
        :key="`listbanner-${i}`"
        class="t-mb-8 t-w-full t-px-1 lg:t-px-2"
      />
    </template>
  </div>
</template>

<script>
import ProductTile from 'theme/components/core/ProductTile'
import ListBanner from 'theme/components/core/blocks/CategoryExtras/ListBanner'

export default {
  name: 'ProductListing',
  components: {
    ProductTile,
    ListBanner
  },
  props: {
    products: {
      type: [Array, null],
      required: true
    },
    columns: {
      type: [Number, String],
      default: 4
    },
    showAddToCart: {
      type: Boolean,
      default: false
    }
  }
}
</script>
