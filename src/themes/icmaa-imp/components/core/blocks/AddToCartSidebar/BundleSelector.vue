<template>
  <div class="t-w-full">
    <div v-for="(option, i) in bundleOptions" :key="'bundleOption_' + option.option_id" class="t-w-full t-flex t-flex-col" :class="{ 't-mt-4': i !== 0 }">
      <h4 class="t-uppercase t-text-xs t-px-2 t-text-base-lighter t-font-bold">
        {{ option.title }}
      </h4>
      <default-selector
        v-for="(selectorOption, j) in option.selectorOptions"
        :key="'productLink_' + selectorOption.option_id"
        :option="selectorOption"
        :label="selectorOption.label"
        :ticked="selectorOption.ticked"
        :product-alert="selectorOption.productAlert"
        :is-last="(j + 1) === option.selectorOptions.length"
      />
    </div>
  </div>
</template>

<script>

import DefaultSelector from 'theme/components/core/blocks/AddToCartSidebar/DefaultSelector'

export default {
  name: 'BundleSelector',
  components: {
    DefaultSelector
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    bundleOptions () {
      return this.product.bundle_options.map(option => {
        option.selectorOptions = option.product_links.map(productLink => {
          const available = productLink.stock.is_in_stock && productLink.stock.qty > 0
          if (option.configurable_options && option.configurable_options.length > 0) {
            const attributeCode = option.configurable_options[0]['attribute_code']
            return {
              option_id: productLink.id,
              available,
              productAlert: false,
              type: attributeCode,
              id: productLink[attributeCode]
            }
          } else {
            return {
              option_id: productLink.id,
              available,
              productAlert: false,
              label: productLink.product.name,
              ticked: true
            }
          }
        })

        return option
      })
    }
  },
  methods: {
    optionChanged ({ fieldName, option, qty, value }) {
      if (!fieldName) return
      this.setBundleOptionValue({ optionId: option.option_id, optionQty: parseInt(qty), optionSelections: [parseInt(value.id)] })
      this.$store.dispatch('product/setBundleOptions', { product: this.product, bundleOptions: this.$store.state.product.current_bundle_options }) // TODO: move it to "AddToCart"
      this.selectedOptions[fieldName] = { qty, value }
      const valueId = value ? value.id : null
      if (this.validateField(option, qty, valueId)) {
        this.$bus.$emit('product-after-bundleoptions', { product: this.product, option: option, optionValues: this.selectedOptions })
      }
    }
  }
}
</script>
