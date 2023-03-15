<template>
  <div data-test-id="ProductTile" class="product t-cursor-pointer">
    <div class="product-cover t-relative t-bg-white" :class="{ 't-mb-4': !onlyImage }">
      <slot name="imageOverlay">
        <wishlist-button class="t-absolute t-bottom-0 t-left-0 t-z-1" :is-overlay="true" :product="product" />
        <div class="t-absolute t-bottom-0 t-right-0 t-z-1 t-w-10 t-h-10 lg:t-w-12 lg:t-h-12 t-bg-base-lighter t-flex t-items-center t-justify-center t-cursor-pointer" v-if="showAddToCart" @click="openAddToCartSidebar" data-test-id="QuickAddToCart">
          <material-icon icon="shopping_cart" class="t-text-white" />
          <span class="t-sr-only">{{ $t('Add to cart') }}</span>
        </div>
      </slot>
      <router-link :to="productLink" data-test-id="productLink" class="product-link t-block t-z-0">
        <promo-banner :product="product" class="t-absolute t-top-0 t-right-0" />
        <product-image :image="thumbnail" :alt="product.translatedName | htmlDecode" data-test-id="productImage" />
      </router-link>
    </div>
    <router-link :to="productLink" tag="div" class="t-text-sm" v-if="!onlyImage">
      <p class="t-text-primary t-leading-tight" :class="{ 't-mb-1': showPrice }" data-test-id="ProductName">
        {{ product.translatedName | htmlDecode }}
      </p>
      <price v-if="showPrice" :product="product" />
    </router-link>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import ProductImage from 'theme/components/core/ProductImage'
import WishlistButton from 'theme/components/core/blocks/Wishlist/WishlistButton'
import PromoBanner from 'theme/components/core/blocks/ProductTile/PromoBanner'
import Price from 'theme/components/core/blocks/ProductTile/Price'
import ProductTileMixin from 'theme/mixins/product/tileMixin'
import ProductOptionsMixin from 'theme/mixins/product/optionsMixin'
import ProductAddToCartMixin from 'theme/mixins/product/addtocartMixin'

export default {
  name: 'ProductTile',
  mixins: [ ProductTileMixin, ProductOptionsMixin, ProductAddToCartMixin ],
  components: {
    MaterialIcon,
    ProductImage,
    PromoBanner,
    Price,
    WishlistButton
  },
  props: {
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
    }
  },
  methods: {
    async openAddToCartSidebar () {
      if (this.isSingleOptionProduct) {
        const product = this.product
        if (this.isOnesizeProduct) {
          /**
           * Bugfix: We need to replace the sku of cart-item by the SKU of the selected-variant
           * to be able to check for it using `productsEquals` in `cart/mergeClientItem` action.
           * Otherwise the product will be removed on reload or the next cart-action if you add
           * an onesize product to cart from CLP.
           */
          Object.assign(product, { sku: product.selectedVariant.sku })
        }

        this.$store.dispatch('ui/loader', { message: i18n.t('Please wait') })
        this.addToCart(product)
          .then(() => { this.$store.dispatch('ui/loader', false) })
          .catch(() => { this.$store.dispatch('ui/loader', false) })

        return
      }

      await this.$store.dispatch('product/loadProduct', { parentSku: this.product.parentSku, childSku: null })
      this.$store.dispatch('ui/setSidebar', { key: 'addtocart' })
    }
  }
}
</script>
