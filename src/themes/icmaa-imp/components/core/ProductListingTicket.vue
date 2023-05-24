<template>
  <div class="product-listing t-mb-8 t-px-4">
    <ul>
      <template v-for="(product, i) in products">
        <product-tile-ticket
          :key="`product-${i}`"
          :product="product"
          class="t-mb-1"
        />
        <list-banner
          v-if="i === 7 || i%28 === 27"
          :key="`listbanner-${i}`"
          class="t-mb-1 t-w-full"
        />
      </template>
    </ul>
  </div>
</template>

<script>
import ProductTileTicket from 'theme/components/core/ProductTileTicket'
import ListBanner from 'theme/components/core/blocks/CategoryExtras/ListBanner'

export default {
  name: 'ProductListingTicket',
  components: {
    ProductTileTicket,
    ListBanner
  },
  props: {
    products: {
      type: null,
      required: true
    }
  }
}
</script>
