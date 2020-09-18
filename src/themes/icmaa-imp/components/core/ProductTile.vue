<template>
  <div data-test-id="ProductTile" class="product t-cursor-pointer" v-observe-visibility="visibilityChanged">
    <div class="product-cover t-relative t-bg-white" :class="{ 't-mb-4': !onlyImage }">
      <slot name="imageOverlay">
        <AddToWishlist class="t-absolute t-bottom-0 t-left-0 t-z-1" :is-overlay="true" :product="product" />
        <div class="t-absolute t-bottom-0 t-right-0 t-z-1 t-w-10 t-h-10 lg:t-w-12 lg:t-h-12 t-bg-base-lighter t-flex t-items-center t-justify-center t-cursor-pointer" v-if="showAddToCart" @click="openAddToCartSidebar" data-test-id="QuickAddToCart">
          <material-icon icon="shopping_cart" class="t-text-white" />
          <span class="t-sr-only">{{ $t('Add to cart') }}</span>
        </div>
      </slot>
      <router-link :to="productLink" data-test-id="productLink" class="product-link t-block t-z-0">
        <promo-banner :product="product" class="t-absolute t-top-0 t-right-0" />
        <placeholder ratio="161:233" v-if="imageLoading" />
        <product-image :image="thumbnail" :alt="product.name | htmlDecode" data-test-id="productImage" @load="imageLoading = false" />
      </router-link>
    </div>
    <router-link :to="productLink" tag="div" class="t-text-sm" v-if="!onlyImage">
      <p class="t-text-primary t-leading-tight" :class="{ 't-mb-1': showPrice }" data-test-id="ProductName">
        {{ translatedProductName | htmlDecode }}
      </p>
      <p v-if="showPrice">
        <span class="price-original t-text-base-light t-line-through t-mr-2" v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0" data-test-id="originalPrice">
          {{ price(product.original_price_incl_tax) }}
        </span>
        <span class="price-special t-text-sale t-font-bold" v-if="product.special_price && parseFloat(product.special_price) > 0" data-test-id="specialPrice">
          <span v-if="hasMultiplePrices" v-text="$t('as low as')" />
          {{ price(product.price_incl_tax) }}
        </span>
        <span class="price t-text-base-dark t-font-bold" v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0" data-test-id="price">
          <span v-if="hasMultiplePrices" v-text="$t('as low as')" />
          {{ price(product.price_incl_tax) }}
        </span>
      </p>
    </router-link>
  </div>
</template>

<script>
import config from 'config'
import i18n from '@vue-storefront/i18n'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import Placeholder from 'theme/components/core/blocks/Placeholder'
import ProductImage from 'theme/components/core/ProductImage'
import AddToWishlist from 'theme/components/core/blocks/Wishlist/AddToWishlist'
import PromoBanner from 'theme/components/core/blocks/Category/PromoBanner'
import ProductTileMixin from 'theme/mixins/product/tileMixin'
import ProductNameMixin from 'icmaa-catalog/mixins/ProductNameMixin'
import ProductPriceMixin from 'theme/mixins/product/priceMixin'
import ProductOptionsMixin from 'theme/mixins/product/optionsMixin'
import ProductAddToCartMixin from 'theme/mixins/product/addtocartMixin'
import { IsOnWishlist } from '@vue-storefront/core/modules/wishlist/components/IsOnWishlist'
import { productThumbnailPath } from '@vue-storefront/core/helpers'

export default {
  name: 'ProductTile',
  mixins: [ProductTileMixin, IsOnWishlist, ProductNameMixin, ProductPriceMixin, ProductOptionsMixin, ProductAddToCartMixin],
  components: {
    MaterialIcon,
    Placeholder,
    ProductImage,
    PromoBanner,
    AddToWishlist
  },
  data () {
    return {
      imageLoading: true
    }
  },
  props: {
    labelsActive: {
      type: Boolean,
      default: true
    },
    onlyImage: {
      type: Boolean,
      default: false
    },
    showPrice: {
      type: Boolean,
      default: true
    },
    showAddToCart: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    thumbnail () {
      return this.product.image
    },
    favoriteIcon () {
      return this.isOnWishlist ? 'favorite' : 'favorite_border'
    }
  },
  methods: {
    async openAddToCartSidebar () {
      if (this.isSingleOptionProduct) {
        this.$bus.$emit('notification-progress-start', i18n.t('Please wait'))
        this.addToCart(this.product)
          .then(() => { this.$bus.$emit('notification-progress-stop') })
          .catch(() => { this.$bus.$emit('notification-progress-stop') })

        return
      }

      await this.$store.dispatch('product/loadProduct', { parentSku: this.product.parentSku, childSku: null })
      this.$store.dispatch('ui/setSidebar', { key: 'addtocart' })
    }
  }
}
</script>
