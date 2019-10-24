<template>
  <li class="t-flex t-py-2 t-border-b">
    <div class="t-w-1/3 t-mr-4">
      <product-image :image="image" />
    </div>

    <div class="t-w-2/3 t-flex t-flex-col">
      <div>
        <router-link class="t-text-primary" :to="productLink" data-testid="productLink" @click.native="$store.dispatch('ui/setMicrocart', false)">
          {{ product.name | htmlDecode }}
        </router-link>
      </div>
      <div class="t-flex t-flex-grow t-justify-between t-items-center t-mb-3">
        <div class="t-w-1/2">
          <div class="t-text-sm t-font-bold" v-if="isTotalsActive">
            <div class="t-flex t-flex-wrap t-whitespace-pre" v-for="opt in product.totals.options" :key="opt.label">
              <span class="">{{ opt.label }}: </span>
              <span class="" v-html="opt.value" />
            </div>
          </div>
          <div class="t-text-sm t-font-bold " v-else-if="!editMode && product.options">
            <div class="t-flex t-flex-wrap" v-for="opt in product.options" :key="opt.label">
              <div class="">{{ opt.label }}: </div>
              <div class="" v-html="opt.value" />
            </div>
          </div>
          <div class="t-text-sm" v-if="hasProductErrors">
            {{ product.errors | formatProductMessages }}
          </div>

          <div class="t-text-sm">
            <span>{{ $t('Quantity') }}: </span>
            <span>{{ productQty }}</span>
          </div>
        </div>

        <div class="t-w-1/2 t-flex t-flex-col t-items-center t-text-sm">
          <div class="" v-if="isOnline && product.totals">
            <div class="price-original t-text-base-light t-line-through" v-if="!product.totals.discount_amount">
              {{ (product.totals.row_total - product.totals.discount_amount + product.totals.tax_amount) | price }}
            </div>
            <div class="price-special t-text-sale t-font-bold" v-if="!product.totals.discount_amount">
              {{ product.totals.row_total_incl_tax | price }}
            </div>
          </div>
          <div class="" v-else>
            <span class="">
              {{ ((product.regular_price || product.price_incl_tax) * product.qty) | price }}
            </span>
          </div>
        </div>
      </div>

      <div class="t-flex t-items-center t-flex-wrap">
        <button-component :type="'select'" class="t-mr-4" :size="'sm'" :icon="'remove_shopping_cart'" :icon-only="true" @click="removeItem" />
        <add-to-wishlist :product="product" :button-type="'select'" :size="'sm'" class="t-flex-fix" />
      </div>
    </div>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import Product from '@vue-storefront/core/compatibility/components/blocks/Microcart/Product'

import ButtonComponent from 'theme/components/core/blocks/Button'
import AddToWishlist from 'theme/components/core/blocks/Wishlist/AddToWishlist'

import ProductImage from 'theme/components/core/ProductImage'
import ColorSelector from 'theme/components/core/blocks/Category/Filter/ColorSelector.vue'
import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector.vue'
import RemoveButton from './RemoveButton'
import EditButton from './EditButton'
import BaseInputNumber from 'theme/components/core/blocks/Form/BaseInputNumber'
import { onlineHelper } from '@vue-storefront/core/helpers'
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption'
import { getThumbnailForProduct, getProductConfiguration } from '@vue-storefront/core/modules/cart/helpers'
import ButtonFull from 'theme/components/theme/ButtonFull'
import EditMode from './EditMode'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    ButtonComponent,
    ProductImage,
    AddToWishlist
  },
  mixins: [Product, ProductOption, EditMode],
  computed: {
    hasProductInfo () {
      return this.product.info && Object.keys(this.product.info).length > 0
    },
    hasProductErrors () {
      return this.product.errors && Object.keys(this.product.errors).length > 0
    },
    isTotalsActive () {
      return this.isOnline && !this.editMode && this.product.totals && this.product.totals.options
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    productsAreReconfigurable () {
      return config.cart.productsAreReconfigurable && this.product.type_id === 'configurable' && this.isOnline
    },
    displayItemDiscounts () {
      return config.cart.displayItemDiscounts
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    },
    thumbnail () {
      return getThumbnailForProduct(this.product)
    },
    configuration () {
      return getProductConfiguration(this.product)
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    editMode () {
      return this.getEditingProductId === this.product.id
    },
    productQty () {
      return this.editMode ? this.getEditingQty : this.product.qty
    }
  },
  methods: {
    updateProductVariant () {
      this.updateVariant()
      this.closeEditMode()
    },
    updateProductQty (qty) {
      if (this.editMode) {
        this.editModeSetQty(qty)
        return
      }

      this.updateQuantity(qty)
    },
    removeFromCart () {
      this.$store.dispatch('cart/removeItem', { product: this.product })
    },
    updateQuantity (quantity) {
      this.$store.dispatch('cart/updateQuantity', { product: this.product, qty: quantity })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
.blend {
  flex: 0 0 150px;
}

.image {
  mix-blend-mode: multiply;
  vertical-align: top;
  width: 150px;
  @media (max-width: 767px) {
    width: 100px;
  }
}

.details {
  flex: 1 1 auto;
  display: flex;
  flex-flow: row wrap;
}

.name {
  @media (max-width: 767px) {
    font-size: 14px;
  }
}

.options,
.sku {
  @media (max-width: 767px) {
    font-size: 10px;
  }
}

.qty {
  padding-right: 30px;

  @media (max-width: 767px) {
    font-size: 12px;
  }
}

.actions {
  margin: 0 -5px;
}

.prices {
  flex-direction: column;
  @media (max-width: 767px) {
    padding: 0;
    font-size: 12px;
  }
}

.price-special {
  @media (max-width: 767px) {
    font-size: 14px;
  }
}

.price-original {
  text-decoration: line-through;
}

input {
  width: 30px;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

.flex-wrap {
  flex-wrap: wrap;
}

.edit-mode {
  border-bottom: 1px solid color(white-smoke);
}

.filters {
  flex: 1 1 200px;
}

.update-button {
  font-size: 14px;
  min-width: 150px;
  width: 150px;
  padding: 10px;
}
</style>
