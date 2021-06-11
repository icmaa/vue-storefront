<template>
  <p>
    <span class="price-original t-text-base-light t-line-through t-mr-2" v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0" data-test-id="originalPrice">
      {{ price(product.original_price_incl_tax) }}
    </span>
    <span class="price-special t-text-sale t-font-bold" v-if="product.special_price && parseFloat(product.special_price) > 0" data-test-id="specialPrice">
      <span v-if="hasMultiplePrices" v-text="$t('as low as')" />
      {{ price(lowestPriceInclTax) }}
    </span>
    <span class="price t-text-base-dark t-font-bold" v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0" data-test-id="price">
      <span v-if="hasMultiplePrices" v-text="$t('as low as')" />
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
