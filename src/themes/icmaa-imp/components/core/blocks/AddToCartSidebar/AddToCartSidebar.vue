<template>
  <sidebar :close-on-click="false">
    <template v-slot:top>
      <h2 class="t-self-center t-pl-2 t-text-lg t-text-base-dark">
        <template v-if="getProductOptions.length > 1">
          {{ $t('Choose options') }}
        </template>
        <template v-else>
          {{ $t('Choose {attribute}', { attribute: getProductOptions[0].label }) }}
        </template>
      </h2>
    </template>
    <div class="t-p-1 t-flex t-flex-wrap">
      <template v-if="product.type_id =='configurable'">
        <div class="error t-w-full " v-if="product.errors && Object.keys(product.errors).length > 0">
          {{ product.errors | formatProductMessages }}
        </div>
        <div v-for="option in getProductOptions" :key="option.id" class="t-w-full t-flex t-flex-col">
          <default-selector
            v-for="filter in getAvailableFilters[option.attribute_code]"
            :key="filter.id"
            :variant="filter"
            :selected-filters="getSelectedFilters"
            @change="changeFilter"
          />
        </div>
      </template>
      <product-links
        v-if="product.type_id =='grouped'"
        :products="product.product_links"
      />
      <product-bundle-options
        v-if="product.bundle_options && product.bundle_options.length > 0"
        :product="product"
      />
      <product-custom-options
        v-else-if="product.custom_options && product.custom_options.length > 0"
        :product="product"
      />
      <div v-if="product.type_id !== 'grouped' && product.type_id !== 'bundle'">
        <base-input-number
          :name="getInputName"
          v-model="product.qty"
          :min="quantity ? 1 : 0"
          :max="quantity"
          :disabled="quantity ? false : true"
          :value="quantity ? 1 : 0"
          @blur="$v.$touch()"
          :validations="[
            {
              condition: $v.product.qty.$error && !$v.product.qty.minValue,
              text: $t('Quantity must be above 0')
            }
          ]"
        />
        <Spinner v-if="isQtyLoading" />
      </div>
      <add-to-cart
        :product="product"
        :disabled="($v.product.qty.$error && !$v.product.qty.minValue) || !quantity && isSimpleOrConfigurable && !isQtyLoading"
      />
    </div>
  </sidebar>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { minValue } from 'vuelidate/lib/validators'
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption.ts'
import Composite from '@vue-storefront/core/mixins/composite'

import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import AddToCart from 'theme/components/core/AddToCart.vue'
import DefaultSelector from 'theme/components/core/blocks/AddToCartSidebar/DefaultSelector'
import ProductLinks from 'theme/components/core/ProductLinks.vue'
import ProductCustomOptions from 'theme/components/core/ProductCustomOptions.vue'
import ProductBundleOptions from 'theme/components/core/ProductBundleOptions.vue'
import Spinner from 'theme/components/core/Spinner'
import BaseInputNumber from 'theme/components/core/blocks/Form/BaseInputNumber'

export default {
  name: 'AddToCartSidebar',
  mixins: [ Composite, ProductOption ],
  components: {
    Sidebar,
    DefaultSelector,
    ProductBundleOptions,
    ProductCustomOptions,
    ProductLinks,
    BaseInputNumber,
    AddToCart,
    Spinner
  },
  data () {
    return {
      isQtyLoading: true,
      quantity: 0
    }
  },
  created () {
    this.getQuantity()
  },
  computed: {
    ...mapGetters({
      product: 'product/productCurrent',
      configuration: 'product/currentConfiguration',
      options: 'product/currentOptions'
    }),
    getProductOptions () {
      if (
        this.product.errors &&
        Object.keys(this.product.errors).length &&
        Object.keys(this.configuration).length
      ) {
        return []
      }
      return this.product.configurable_options
    },
    getAvailableFilters () {
      let filtersMap = {}
      // TODO move to helper
      if (this.product && this.product.configurable_options) {
        this.product.configurable_options.forEach(configurableOption => {
          const type = configurableOption.attribute_code
          const filterVariants = configurableOption.values.map(
            ({ value_index, label }) => {
              let currentVariant = this.options[type].find(
                config => config.id === value_index
              )
              label =
                label || (currentVariant ? currentVariant.label : value_index)
              return { id: value_index, label, type }
            }
          )
          const availableOptions = filterVariants.filter(option =>
            this.isOptionAvailable(option)
          )
          filtersMap[type] = availableOptions
        })
      }
      return filtersMap
    },
    getSelectedFilters () {
      // TODO move to helper when refactoring product page
      let selectedFilters = {}
      if (this.configuration && this.product) {
        Object.keys(this.configuration).map(filterType => {
          const filter = this.configuration[filterType]
          selectedFilters[filterType] = {
            id: filter.id,
            label: filter.label,
            type: filterType
          }
        })
      }
      return selectedFilters
    },
    isSimpleOrConfigurable () {
      if (
        this.product.type_id === 'simple' ||
        this.product.type_id === 'configurable'
      ) { return true }
      return false
    },
    getInputName () {
      if (this.isSimpleOrConfigurable) { return i18n.t('Quantity available', { qty: this.quantity }) }
      return i18n.t('Quantity')
    }
  },
  methods: {
    getQuantity () {
      this.isQtyLoading = true
      this.$store
        .dispatch('stock/check', {
          product: this.product,
          qty: this.product.qte
        })
        .then(res => {
          this.isQtyLoading = false
          this.quantity = res.qty
        })
    },
    changeFilter (variant) {
      this.$bus.$emit(
        'filter-changed-product',
        Object.assign({ attribute_code: variant.type }, variant)
      )
      this.getQuantity()
    }
  },
  validations: {
    product: {
      qty: {
        minValue: minValue(1)
      }
    }
  }
}
</script>
