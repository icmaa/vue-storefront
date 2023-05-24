<template>
  <p>
    <span
      v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0"
      class="price-original t-mr-2 t-text-base-light t-line-through"
      data-test-id="originalPrice"
    >
      {{ price(product.original_price_incl_tax) }}
    </span>
    <span
      v-if="product.special_price && parseFloat(product.special_price) > 0"
      class="price-special t-font-bold t-text-sale"
      data-test-id="specialPrice"
    >
      <span
        v-if="hasMultiplePrices"
        v-text="$t('as low as')"
      />
      {{ price(lowestPriceInclTax) }}
    </span>
    <span
      v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0"
      class="price t-font-bold t-text-base-dark"
      data-test-id="price"
    >
      <span
        v-if="hasMultiplePrices"
        v-text="$t('as low as')"
      />
      {{ price(lowestPriceInclTax) }}
    </span>
  </p>
</template>

<script>
import ProductPriceMixin from 'theme/mixins/product/priceMixin'

export default {
  name: 'PriceBox',
  mixins: [ ProductPriceMixin ],
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>
