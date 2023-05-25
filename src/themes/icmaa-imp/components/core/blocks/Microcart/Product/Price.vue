<template>
  <div
    v-if="product.totals"
    class="t-text-sm"
  >
    <template v-if="product.totals.discount_amount">
      <span class="t-mr-2 t-text-base-light t-line-through">
        {{ product.totals.row_total_incl_tax | price }}
      </span>
      <span class="t-font-bold t-text-sale">
        {{ (product.totals.row_total - product.totals.discount_amount + product.totals.tax_amount) | price }}
      </span>
    </template>
    <template v-else>
      <span
        v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0"
        class="price-original t-mr-2 t-text-base-light t-line-through"
      >
        {{ product.original_price_incl_tax | price }}
      </span>
      <span
        v-if="product.special_price && parseFloat(product.special_price) > 0"
        class="price-special t-font-bold t-text-sale"
      >
        {{ product.price_incl_tax | price }}
      </span>
      <span
        v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0"
        class="price t-font-bold t-text-base-dark"
      >
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
