<template>
  <div @click="click">
    <div :class="{ 't-relative': active }">
      <div
        v-if="active"
        class="t-absolute t-z-1 t-flex t-h-full t-w-full t-items-center t-justify-center t-border t-border-base-lightest t-bg-white t-opacity-75"
      >
        <MaterialIcon
          icon="check"
          size="xl"
          class="t-text-alt-3"
        />
      </div>
      <ProductImage
        :image="product.image"
        :alt="product.translatedName | htmlDecode"
        data-test-id="productImage"
        class="t-mb-2 t-block t-border t-border-base-lightest"
      />
    </div>
    <p
      class="t-mb-1 t-text-xs t-leading-tight"
      v-text="product.translatedName"
    />
    <ProductPrice
      :product="product"
      :alt="product.name | htmlDecode"
      class="t-text-xs"
    />
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
