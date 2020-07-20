<template>
  <sidebar :title="productOptionsLabelPlaceholder" :close-on-click="false">
    <div class="t-flex t-flex-wrap t-pb-20">
      <template v-if="product.type_id === 'configurable'">
        <div class="error t-w-full " v-if="product.errors && Object.keys(product.errors).length > 0">
          {{ product.errors | formatProductMessages }}
        </div>
        <div v-for="option in productOptions" :key="option.id" class="t-w-full t-flex t-flex-col">
          <default-selector
            v-for="(filter, key) in availableFilters[option.attribute_code]"
            :key="key"
            :option="filter"
            @change="onSelect"
            :price="getOptionPrice(filter)"
            :is-last="key === Object.keys(availableFilters[option.attribute_code]).length - 1"
            :is-loading="isLoading"
            :is-active="selectedOption && selectedOption.id === filter.id"
          />
        </div>
      </template>
      <template v-if="product.type_id === 'bundle'">
        <bundle-selector
          :product="product"
          @change="onBundleSelect"
        />
      </template>
      <div class="t-flex t-flex-wrap t-mt-6 t-w-full">
        <model :product="product" class="t-w-full t-p-4 t-mb-px t-bg-base-lightest t-text-sm t-text-base-tone" />
        <router-link :to="localizedRoute('/service-size')" class="t-w-full t-p-4 t-bg-base-lightest t-text-sm t-text-primary" @click.native="$emit('close')">
          {{ $t('Which size fits me?') }}
          <material-icon icon="call_made" size="md" class="t-float-right t-align-middle" />
        </router-link>
      </div>
      <div class="t-flex t-flex-wrap t-mt-6 t-w-full" v-if="showAddToCartButton">
        ADD-TO-CART
      </div>
    </div>
  </sidebar>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'
import { filterChangedProduct } from '@vue-storefront/core/modules/catalog/events'
import Composite from '@vue-storefront/core/mixins/composite'
import ProductPriceMixin from 'theme/mixins/product/priceMixin'
import ProductOptionsMixin from 'theme/mixins/product/optionsMixin'
import ProductStockAlertMixin from 'icmaa-product-alert/mixins/productStockAlertMixin'

import Sidebar from 'theme/components/core/blocks/AsyncSidebar/Sidebar'
import DefaultSelector from 'theme/components/core/blocks/AddToCartSidebar/DefaultSelector'
import BundleSelector from 'theme/components/core/blocks/AddToCartSidebar/BundleSelector'
import Model from 'theme/components/core/blocks/AddToCartSidebar/Model'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'AddToCartSidebar',
  mixins: [ Composite, ProductOptionsMixin, ProductPriceMixin, ProductStockAlertMixin ],
  components: {
    Sidebar,
    DefaultSelector,
    BundleSelector,
    Model,
    MaterialIcon
  },
  props: {
    showAddToCartButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedOption: undefined,
      loading: false,
      quantity: 0
    }
  },
  mounted () {
    this.setSelectedOptionByCurrentConfiguration()
  },
  computed: {
    ...mapGetters({
      product: 'product/getCurrentProduct',
      configuration: 'product/getCurrentProductConfiguration',
      options: 'product/getCurrentProductOptions',
      isAddingToCart: 'cart/getIsAdding'
    }),
    isLoading () {
      return this.loading || this.isAddingToCart
    }
  },
  methods: {
    setSelectedOptionByCurrentConfiguration () {
      if (this.product.type_id !== 'configurable') {
        return
      }

      this.productOptions.find(filter => {
        const options = this.availableFilters[filter.attribute_code]
        return options.find(option => {
          const selectedVariantFilter = this.selectedFilters[option.type]
          if (!selectedVariantFilter) {
            return false
          }

          if (Array.isArray(selectedVariantFilter)) {
            return !!selectedVariantFilter.find(o => o.id === option.id)
          }

          if (selectedVariantFilter.id === option.id) {
            this.selectedOption = option
          }
        })
      })
    },
    async onSelect (option) {
      if (option.available) {
        this.loading = true

        // We need to set the new configuration here already to enable the loading state for the selected option
        this.$store.dispatch('product/updateConfiguration', { option })
        this.setSelectedOptionByCurrentConfiguration()

        const configuration = Object.assign({ attribute_code: option.type }, option)
        await filterChangedProduct(configuration, this.$store, this.$router)

        this.$bus.$emit('user-has-selected-product-variant')

        this.loading = false
        this.$store.dispatch('ui/closeAll')
      } else {
        this.selectedOption = option
        this.addProductStockAlert(option)
      }
    },
    async onBundleSelect (option) {
      this.$bus.$emit('user-has-selected-product-variant')
    },
    getOptionPrice (option) {
      if (this.hasMultiplePrices) {
        const product = this.product.configurable_children.find(child => child[option.type] === option.id)
        if (product) {
          return product.price_incl_tax || product.original_price_incl_tax
        }
      }

      return false
    }
  }
}
</script>
