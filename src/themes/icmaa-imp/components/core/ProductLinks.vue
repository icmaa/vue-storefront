<template>
  <div class="links py10">
    <div
      v-for="(productLink, index) in products"
      :key="index"
      class="between-md"
    >
      <div
        v-if="productLink.product"
        class="py10"
      >
        <div class="row middle-xs h4 mb10">
          <p class="col-xs-7 serif m0">
            {{ productLink.product.name | htmlDecode }}
          </p>
          <div class="col-xs-4 cl-bg-tertiary">
            <div v-if="productLink.product.special_price && productLink.product.price_incl_tax && productLink.product.original_price_incl_tax">
              <span class="price-special">{{ productLink.product.price_incl_tax | price }}</span>&nbsp;
              <span class="price-original">{{ productLink.product.original_price_incl_tax | price }}</span>
            </div>
            <div v-if="!productLink.product.special_price && productLink.product.price_incl_tax">
              {{ productLink.product.price_incl_tax | price }}
            </div>
          </div>
        </div>

        <div
          v-if="productLink.product"
          class="py5"
        >
          <p class="h6 cl-bg-tertiary m0">
            {{ $t('Quantity') }}
          </p>
          <input
            v-model.number="productLink.product.qty"
            type="number"
            class="product-qty py10 brdr-cl-primary bg-cl-transparent h4"
            min="1"
            autofocus
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    products: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.product-qty {
  border-style: solid;
  border-width: 0 0 1px 0;
  width: 90px;
}
</style>
