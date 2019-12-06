<template>
  <div>
    <router-link :to="productLink" :title="product.name" class="t-block">
      {{ translatedProductName }}
      <product-image :image="imageDTO" />
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getThumbnailPath, productThumbnailPath } from '@vue-storefront/core/helpers'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import ProductNameMixin from 'icmaa-catalog/mixins/ProductNameMixin'
import ProductImage from 'theme/components/core/ProductImage'

export default {
  name: 'MyOrderReviewProduct',
  mixins: [ ProductNameMixin ],
  components: {
    ProductImage
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    image () {
      let thumbnail = productThumbnailPath(this.product)
      return this.getThumbnail(thumbnail)
    },
    imageDTO () {
      return {
        src: this.image,
        loading: this.image
      }
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    }
  }
}
</script>
