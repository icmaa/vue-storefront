<template>
  <li class="t-flex t-border-b t-border-base-lightest t-py-2">
    <div class="t-mr-4 t-w-1/3">
      <ProductImage
        :image="thumbnail"
        :alt="product.translatedName | htmlDecode"
      />
    </div>

    <div class="t-flex t-w-2/3 t-flex-col t-py-2">
      <div class="t-mb-4 t-text-sm t-leading-tight">
        {{ product.translatedName | htmlDecode }}
      </div>

      <div class="t-grow">
        <div
          v-if="totals.length > 0 || isFree"
          class="t-mb-2 t-flex t-w-full t-flex-wrap t-items-center"
        >
          <ButtonComponent
            v-for="opt in totals"
            :key="opt.label"
            class="t-mb-2 t-mr-2"
            type="tag"
            size="xs"
            :cursor-pointer="false"
          >
            {{ opt.value }}
          </ButtonComponent>
          <div
            v-if="isFree"
            class="t-mb-2 t-text-xs t-font-bold t-uppercase t-text-sale"
          >
            {{ $t('Free') }}
          </div>
        </div>

        <div
          v-if="hasProductErrors"
          class="t-text-sm"
        >
          {{ product.errors | formatProductMessages }}
        </div>
      </div>

      <div class="t-flex t-flex-wrap t-items-center t-justify-between">
        <div class="t-text-sm">
          {{ productQty }} {{ $t('Pcs.') }}
        </div>
        <ProductPrice :product="product" />
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
