<template>
  <li class="t-flex t-py-2 t-border-b t-border-base-lightest">
    <div class="t-w-1/3 t-mr-4">
      <product-image :image="thumbnail" :alt="product.name | htmlDecode" />
    </div>

    <div class="t-w-2/3 t-flex t-flex-col t-py-2">
      <div class="t-mb-4 t-leading-tight t-text-sm">
        {{ product.translatedName | htmlDecode }}
      </div>

      <div class="t-flex-grow">
        <div class="t-flex t-w-full t-flex-wrap t-items-center t-mb-2" v-if="totals.length > 0 || isFree">
          <button-component class="t-mr-2 t-mb-2" type="tag" size="xs" :cursor-pointer="false" v-for="opt in totals" :key="opt.label">
            {{ opt.value }}
          </button-component>
          <div class="t-text-xs t-text-sale t-font-bold t-uppercase t-mb-2" v-if="isFree">
            {{ $t('Free') }}
          </div>
        </div>

        <div class="t-text-sm" v-if="hasProductErrors">
          {{ product.errors | formatProductMessages }}
        </div>
      </div>

      <div class="t-flex t-items-center t-flex-wrap t-justify-between">
        <div class="t-text-sm">
          {{ productQty }} {{ $t('Pcs.') }}
        </div>
        <product-price :product="product" />
      </div>
    </div>
  </li>
</template>

<script>
import ProductMixin from 'theme/mixins/cart/productMixin'
import ProductPrice from 'theme/components/core/blocks/Microcart/Product/Price'
import ProductImage from 'theme/components/core/ProductImage'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'MicroCartProduct',
  components: {
    ButtonComponent,
    ProductImage,
    ProductPrice
  },
  mixins: [ ProductMixin ]
}
</script>
