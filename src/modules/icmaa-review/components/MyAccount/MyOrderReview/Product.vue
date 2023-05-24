<template>
  <div class="t--mx-2 t-flex t-flex-wrap">
    <div class="t-mb-4 t-hidden t-px-2 lg:t-block lg:t-w-1/3">
      <product-tile :product="product" />
    </div>
    <div class="t-w-full t-px-2 lg:t-w-2/3">
      <div class="t-bg-white t-p-4">
        <router-link
          :to="productLink"
          :title="product.name"
          class="t-mb-4 t-block t-text-lg t-text-primary"
        >
          {{ product.translatedName }}
        </router-link>
        <review-form :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import { formatProductLink } from 'icmaa-url/helpers'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import ProductTile from 'theme/components/core/ProductTile'
import ReviewForm from 'theme/components/core/blocks/Reviews/ReviewsForm'

export default {
  name: 'MyOrderReviewProduct',
  components: {
    ProductTile,
    ReviewForm
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    }
  }
}
</script>
