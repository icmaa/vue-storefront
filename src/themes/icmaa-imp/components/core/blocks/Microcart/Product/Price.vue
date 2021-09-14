<template>
  <div class="t-text-sm" v-if="product.totals">
    <template v-if="product.totals.discount_amount">
      <span class="t-text-base-light t-line-through t-mr-2">
        {{ product.totals.row_total_incl_tax | price }}
      </span>
      <span class="t-text-sale t-font-bold">
        {{ (product.totals.row_total - product.totals.discount_amount + product.totals.tax_amount) | price }}
      </span>
    </template>
    <template v-else>
      <span class="price-original t-text-base-light t-line-through t-mr-2" v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0">
        {{ product.original_price_incl_tax | price }}
      </span>
      <span class="price-special t-text-sale t-font-bold" v-if="product.special_price && parseFloat(product.special_price) > 0">
        {{ product.price_incl_tax | price }}
      </span>
      <span class="price t-text-base-dark t-font-bold" v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0">
        {{ product.price_incl_tax | price }}
      </span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ProductPrice',
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>
