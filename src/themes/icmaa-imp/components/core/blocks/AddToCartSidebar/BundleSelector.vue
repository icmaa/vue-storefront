<template>
  <div class="t-w-full">
    <div
      v-if="isChildOutOfStock"
      class="t-mb-4 t-flex t-bg-alert t-p-4 t-text-sm t-text-white"
      data-test-id="BundleOutOfStock"
    >
      <MaterialIcon
        icon="report_problem"
        class="t-mr-2"
      />
      <div>
        {{ $t('Sorry, but some required bundle items are currently out-of-stock.') }}
      </div>
    </div>
    <div
      v-for="(option, i) in bundleOptions"
      :key="'bundleOption_' + option.option_id"
      class="t-flex t-w-full t-flex-col"
      :class="{ 't-mt-4': i !== 0 }"
      data-test-id="BundleOption"
    >
      <h4 class="t-px-2 t-text-xs t-font-bold t-uppercase t-text-base-lighter">
        {{ option.title }}
      </h4>
      <DefaultSelector
        v-for="(selectorOption, j) in option.selectorOptions"
        :key="`productLink_${selectorOption.optionId}_${selectorOption.productLink.id}`"
        :option="selectorOption"
        :label="selectorOption.label"
        :ticked="selectorOption.ticked"
        :product-alert="selectorOption.productAlert"
        :is-last="(j + 1) === option.selectorOptions.length"
        :is-disabled="disableSelection"
        @change="optionChanged"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import DefaultSelector from 'theme/components/core/blocks/AddToCartSidebar/DefaultSelector'

export default {
  name: 'BundleSelector',
  components: {
    DefaultSelector,
    MaterialIcon
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    disableSelection: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      currentBundleOptions: 'product/getCurrentBundleOptions',
      isCurrentBundleOptionsSelection: 'product/isCurrentBundleOptionsSelection'
    }),
    isChildOutOfStock () {
      const options = this.bundleOptions
      const availableOptions = this.bundleOptions.filter(o => o.selectorOptions.some(o => o.available === true))
      return availableOptions.length !== options.length
    },
    bundleOptions () {
      return this.product.bundle_options.map(option => {
        option.selectorOptions = option.product_links.map(productLink => {
          let selectorOption

          const ticked = Object.values(this.currentBundleOptions).some(o => {
            return o.option_id === option.option_id && o.option_selections.includes(productLink.id)
          })

          if (option.configurable_options && option.configurable_options.length > 0) {
            const attributeCode = option.configurable_options[0]['attribute_code']
            selectorOption = {
              type: attributeCode,
              id: productLink[attributeCode],
              optionId: option.option_id,
              productLink
            }
          } else {
            selectorOption = {
              label: productLink.name || productLink.product?.name || productLink.sku,
              optionId: option.option_id,
              productLink
            }
          }

          const available = productLink.stock.is_in_stock && productLink.stock.qty > 0
          return Object.assign(
            {
              available,
              ticked: (ticked && available),
              productAlert: false
            },
            selectorOption
          )
        })

        return option
      })
    }
  },
  mounted () {
    // Select first option if only one is found for a bundle option
    this.bundleOptions.forEach(option => {
      if (option.selectorOptions.length === 1 && option.selectorOptions[0].available === true) {
        this.$store.dispatch('product/updateBundleOptions', option.selectorOptions[0])
      }
    })
  },
  methods: {
    optionChanged (option) {
      if (option.available !== true) {
        return
      }

      this.$store.dispatch('product/updateBundleOptions', option)
      if (this.isCurrentBundleOptionsSelection && !this.isChildOutOfStock) {
        this.$emit('change', option)
      }
    }
  }
}
</script>
