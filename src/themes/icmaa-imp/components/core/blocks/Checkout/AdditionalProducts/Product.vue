<template>
  <div @click="click">
    <div :class="{ 't-relative': active }">
      <div
        v-if="active"
        class="t-absolute t-z-1 t-w-full t-h-full t-flex t-items-center t-justify-center t-bg-white t-border t-border-base-lightest t-opacity-75"
      >
        <material-icon icon="check" size="xl" class="t-text-alt-3" />
      </div>
      <product-image
        :image="product.image"
        :alt="product.translatedName | htmlDecode"
        data-test-id="productImage"
        class="t-block t-border t-border-base-lightest t-mb-2"
      />
    </div>
    <p class="t-text-xs t-leading-tight t-mb-1" v-text="product.translatedName" />
    <product-price :product="product" :alt="product.name | htmlDecode" class="t-text-xs" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import productsEquals from '@vue-storefront/core/modules/cart/helpers/productsEquals'
import ProductImage from 'theme/components/core/ProductImage'
import ProductPrice from 'theme/components/core/blocks/ProductTile/Price'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'AdditionalProduct',
  components: {
    ProductImage,
    ProductPrice,
    MaterialIcon
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      cartItems: 'cart/getCartItems'
    }),
    active () {
      return !!this.item
    },
    item () {
      return this.cartItems
        .find(i => productsEquals(i, this.product.selectedVariant || this.product)) || false
    }
  },
  methods: {
    click () {
      if (this.active) {
        this.$emit('remove-from-cart', this.item)
      } else {
        this.$emit('add-to-cart', this.product)
      }
    }
  }
}
</script>
