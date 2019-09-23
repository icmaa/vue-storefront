<template>
  <div class="t-text-sm">
    <div class="description">
      {{ product.description | htmlDecode }}
    </div>
    <ul class="attributes  t-mt-6">
      <product-attributes
        :key="attr.attribute_code"
        v-for="attr in attributes"
        :product="product"
        :attribute="attr"
        empty-placeholder="N/A"
        class="t-mb-3"
      />
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductAttributes from 'theme/components/core/blocks/Product/ProductAttributes'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    ProductAttributes
  },
  computed: {
    ...mapGetters({
      attributesByCode: 'attribute/attributeListByCode'
    }),
    attributes () {
      return Object.values(this.attributesByCode).filter(a => {
        return a.is_visible && a.is_user_defined && (parseInt(a.is_visible_on_front) || a.is_visible_on_front === true) && this.product[a.attribute_code]
      })
    }
  }
}
</script>
