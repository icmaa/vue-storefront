<template>
  <div class="t-w-full">
    <div class="t-bg-alert t-p-4 t-mb-4 t-text-white t-text-sm t-flex" v-if="isChildOutOfStock">
      <material-icon icon="report_problem" class="t-mr-2" />
      <div>
        {{ $t('Sorry, but some required bundle items are currently out-of-stock.') }}
      </div>
    </div>
    <div v-for="(option, i) in bundleOptions" :key="'bundleOption_' + option.option_id" class="t-w-full t-flex t-flex-col" :class="{ 't-mt-4': i !== 0 }">
      <h4 class="t-uppercase t-text-xs t-px-2 t-text-base-lighter t-font-bold">
        {{ option.title }}
      </h4>
      <default-selector
        v-for="(selectorOption, j) in option.selectorOptions"
        :key="`productLink_${selectorOption.optionId}_${selectorOption.productLink.id}`"
        :option="selectorOption"
        :label="selectorOption.label"
        :ticked="selectorOption.ticked"
        :product-alert="selectorOption.productAlert"
        :is-last="(j + 1) === option.selectorOptions.length"
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
    }
  },
  computed: {
    ...mapGetters({
      currentBundleOptions: 'product/getCurrentBundleOptions',
      isCurrentBundleOptionsSelection: 'product/isCurrentBundleOptionsSelection'
    }),
    isChildOutOfStock () {
      return this.bundleOptions
        .filter(o => o.selectorOptions.some(o => o.available === true))
        .length !== this.bundleOptions.length
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
              label: productLink.product.name,
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
  methods: {
    optionChanged (option) {
      if (option.available !== true) {
        return
      }

      this.$store.dispatch('product/updateBundleOptions', option)
      if (this.isCurrentBundleOptionsSelection && !this.isChildOutOfStock) {
        this.$store.dispatch('ui/closeAll')
        this.$bus.$emit('change')
      }
    }
  },
  mounted () {
    // Select first option if only one is found for a bundle option
    this.bundleOptions.forEach(option => {
      if (option.selectorOptions.length === 1 && option.selectorOptions[0].available === true) {
        this.$store.dispatch('product/updateBundleOptions', option.selectorOptions[0])
      }
    })
  }
}
</script>
