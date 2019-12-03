<template>
  <div class="product-listing t-flex t-flex-wrap t-justify-start t-px-3 lg:t-px-4 lg:t--mx-2">
    <template v-for="(product, i) in products">
      <product-tile-list v-if="isParentIdInWhitelist" :product="product" :key="`product-${i}`" class="t-w-full" />
      <product-tile v-if="!isParentIdInWhitelist" :product="product" :key="`product-${i}`" class="t-px-1 lg:t-px-2 t-mb-8" :class="[ 't-w-1/2 lg:t-w-1/' + columns ]" />
      <list-banner v-if="i === 7 || i%28 === 27" :key="`listbanner-${i}`" class="t-w-full t-px-1 lg:t-px-2 t-mb-8" />
    </template>
  </div>
</template>

<script>
import config from 'config'
import ProductTile from 'theme/components/core/ProductTile'
import ProductTileList from 'theme/components/core/ProductTileList'
import ListBanner from 'theme/components/core/blocks/CategoryExtras/ListBanner'
import { mapGetters } from 'vuex'

export default {
  name: 'ProductListing',
  components: {
    ProductTile,
    ProductTileList,
    ListBanner
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
    ...mapGetters({
      getCurrentCategory: 'category-next/getCurrentCategory'
    }),
    isParentIdInWhitelist () {
      let category = this.getCurrentCategory.parent_id
      let whitelist = config.icmaa.catalog.productListParentCategoryWhitelist
      return whitelist.includes(category)
    }
  }
}
</script>
