<template>
  <li class="t-mr-4 t-flex t-w-full t-py-2">
    <div class="t-mr-4 t-w-1/3">
      <router-link :to="productLink">
        <ProductImage
          :image="thumbnail"
          :alt="product.translatedName | htmlDecode"
        />
      </router-link>
    </div>
    <div class="t-flex t-w-2/3 t-flex-col t-justify-between t-py-2">
      <div class="t-mb-2">
        <router-link
          :to="productLink"
          class="t-block t-w-full t-text-sm t-leading-tight t-text-primary"
        >
          {{ product.translatedName | htmlDecode }}
        </router-link>
      </div>
      <div class="t-mb-2 t-pb-4 t-text-sm t-text-base-light">
        <span
          v-if="product.special_price"
          class="price-original t-mr-2 t-text-base-light t-line-through"
        >{{ product.original_price_incl_tax | price }}</span>
        <span
          v-if="product.special_price"
          class="price-special t-font-bold t-text-sale"
        >{{ product.price_incl_tax | price }}</span>
        <span
          v-if="!product.special_price"
          class="price t-font-bold t-text-base-dark"
        >{{ product.price_incl_tax | price }}</span>
      </div>
      <div class="t-flex t-grow t-items-end">
        <ButtonComponent
          type="primary"
          class="t-grow"
          @click.native="redirect"
        >
          {{ $t('Add to cart') }}
        </ButtonComponent>
        <WishlistButton
          :product="product"
          :icon-remove="'delete'"
          :button-type="'transparent'"
          class="t-flex-fix"
          @click.native.stop
        />
      </div>
    </div>
  </li>
</template>

<script>
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from 'icmaa-url/helpers'
import ProductImage from 'theme/components/core/ProductImage'
import ButtonComponent from 'theme/components/core/blocks/Button'
import WishlistButton from 'theme/components/core/blocks/Wishlist/WishlistButton'

export default {
  components: {
    WishlistButton,
    ProductImage,
    ButtonComponent
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
    },
    thumbnail () {
      return this.product.image
    }
  },
  methods: {
    redirect () {
      this.$router.push(this.productLink)
    }
  }
}
</script>
