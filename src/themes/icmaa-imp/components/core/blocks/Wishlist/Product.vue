<template>
  <li class="t-w-full t-flex t-px-4 t-mb-4 t-bg-white t-py-1">
    <div class="t-w-1/3">
      <router-link :to="productLink">
        <product-image :image="image" />
      </router-link>
    </div>
    <div class="t-w-2/3 t-flex t-flex-col t-px-2 t-py-4 t-justify-between">
      <div class="t-text-primary t-text-sm t-mb-4 t-leading-tight">
        <router-link :to="productLink" class="t-text-primary t-w-full t-text-sm t-leading-tight">
          {{ product.name | htmlDecode }}
        </router-link>
      </div>

      <div class="t-mb-4 t-text-sm t-text-base-light">
        <span class="t-text-base-tone t-line-through" v-if="product.special_price">{{ product.original_price_incl_tax | price }}</span>
        <span class="t-text-sale" v-if="product.special_price">{{ product.price_incl_tax | price }}</span>
        <span class="price t-text-base-dark t-font-bold" v-if="!product.special_price">{{ product.price_incl_tax | price }}</span>
      </div>

      <div class="t-flex t-flex-grow t-items-end">
        <button-component type="primary" class="t-flex-grow lg:t-w-2/6 disabled:t-opacity-75 t-relative" @click.native="redirect">
          {{ $t('Add to cart') }}
        </button-component>

        <add-to-wishlist :product="product" class="t-flex-fix t-ml-4" />
      </div>
    </div>
  </li>
</template>

<script>
import Product from '@vue-storefront/core/compatibility/components/blocks/Wishlist/Product'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import { htmlDecode } from '@vue-storefront/core/lib/store/filters'
import i18n from '@vue-storefront/i18n'
import ProductImage from 'theme/components/core/ProductImage'
import ButtonComponent from 'theme/components/core/blocks/Button'
import AddToWishlist from 'theme/components/core/blocks/Wishlist/AddToWishlist'

export default {
  components: {
    AddToWishlist,
    ProductImage,
    ButtonComponent
  },
  mixins: [Product],
  computed: {
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    }
  },
  methods: {
    redirect () {
      this.$router.push(this.localizedRoute(this.productLink))
    }
  }
}
</script>
