<template>
  <sidebar :close-on-click="false">
    <template v-slot:top>
      <h2 class="t-self-center t-pl-2 t-text-lg t-text-base-dark">
        {{ productOptionsLabel }}
      </h2>
    </template>
    <div class="t-p-1 t-w-full t-flex t-flex-wrap">
      <div v-if="isLoading">
        LOADING - THIS IS NOT WORKING – PARALLEL ASYNC REQUESTS
      </div>
      <template v-if="product.type_id =='configurable'">
        <div class="error t-w-full " v-if="product.errors && Object.keys(product.errors).length > 0">
          {{ product.errors | formatProductMessages }}
        </div>
        <div v-for="option in productOptions" :key="option.id" class="t-w-full t-flex t-flex-col">
          <default-selector
            v-for="(filter, key) in getAvailableFilters[option.attribute_code]"
            :key="key"
            :variant="filter"
            :selected-filters="getSelectedFilters"
            @change="changeFilter"
            :is-last="key === Object.keys(getAvailableFilters[option.attribute_code]).length - 1"
            :is-loading="isLoading"
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
      <model :product="product" class="t-w-full t-p-4 t-mt-6 t-mb-px t-bg-base-lightest t-text-sm t-text-base-tone" />
      <router-link to="size-chart" class="t-w-full t-p-4 t-bg-base-lightest t-text-sm t-text-primary">
        {{ $t('Which size fits me?') }}
        <material-icon icon="call_made" size="md" class="t-float-right t-align-middle" />
      </router-link>
    </div>
  </sidebar>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { minValue } from 'vuelidate/lib/validators'
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'
import Composite from '@vue-storefront/core/mixins/composite'
import ProductOptionsMixin from 'theme/mixins/product/optionsMixin'

import Sidebar from 'theme/components/theme/blocks/AsyncSidebar/Sidebar'
import DefaultSelector from 'theme/components/core/blocks/AddToCartSidebar/DefaultSelector'
import ProductLinks from 'theme/components/core/ProductLinks.vue'
import ProductCustomOptions from 'theme/components/core/ProductCustomOptions.vue'
import ProductBundleOptions from 'theme/components/core/ProductBundleOptions.vue'
import Model from 'theme/components/core/blocks/AddToCartSidebar/Model'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'AddToCartSidebar',
  mixins: [ Composite, ProductOption, ProductOptionsMixin ],
  components: {
    Sidebar,
    DefaultSelector,
    ProductBundleOptions,
    ProductCustomOptions,
    ProductLinks,
    Model,
    MaterialIcon
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
      options: 'product/currentOptions',
      isAddingToCart: 'cart/getIsAdding'
    }),
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
    isLoading () {
      return this.isQtyLoading || this.isAddingToCart
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
      this.addToCart(this.product)
    },
    async addToCart (product) {
      try {
        const diffLog = await this.$store.dispatch('cart/addItem', { productToAdd: product })
        diffLog.clientNotifications.forEach(notificationData => {
          this.notifyUser(notificationData)
        })
      } catch (message) {
        this.notifyUser(notifications.createNotification({ type: 'error', message }))
      }
    },
    notifyUser (notificationData) {
      this.$store.dispatch('notification/spawnNotification', notificationData, { root: true })
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
