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
            :is-loading="loading"
            :is-active="selectedOption && selectedOption.id === filter.id"
            :is-disabled="disableSelection"
            :ticked="!closeOnSelect && !loading && userSelection && selectedOption && selectedOption.id === filter.id"
          />
        </div>
      </template>
      <template v-if="product.type_id === 'bundle'">
        <bundle-selector
          :product="product"
          :disable-selection="disableSelection"
          @change="onBundleSelect"
        />
      </template>
      <div class="t-flex t-flex-wrap t-mt-4 t-w-full">
        <model :product="product" class="t-w-full t-p-4 t-mb-px t-bg-base-lightest t-text-sm t-text-base-tone" />
        <router-link :to="localizedRoute('/service-size')" class="t-w-full t-p-4 t-bg-base-lightest t-text-sm t-text-primary" @click.native="$emit('close')">
          {{ $t('Which size fits me?') }}
          <material-icon icon="call_made" size="md" class="t-float-right t-align-middle" />
        </router-link>
      </div>
      <div class="t-flex t-flex-wrap t-mt-4 t-w-full" v-if="showAddToCartButton">
        <button-component :type="!selectedOption || !isAddToCartDisabled ? 'primary' : 'second'" data-test-id="AddToCart" class="t-flex-grow disabled:t-opacity-50 t-relative" :disabled="isAddToCartDisabled" @click.native="addToCartButtonClick">
          {{ userSelection && isAddToCartDisabled && !loading ? $t('Out of stock') : $t('Add to cart') }}
          <loader-background v-if="isAddingToCart" class="t-bottom-0" height="t-h-1" bar="t-bg-base-lightest t-opacity-25" />
        </button-component>
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
import ProductAddToCartMixin from 'theme/mixins/product/addtocartMixin'
import ProductStockAlertMixin from 'icmaa-product-alert/mixins/productStockAlertMixin'

import Sidebar from 'theme/components/core/blocks/AsyncSidebar/Sidebar'
import DefaultSelector from 'theme/components/core/blocks/AddToCartSidebar/DefaultSelector'
import BundleSelector from 'theme/components/core/blocks/AddToCartSidebar/BundleSelector'
import Model from 'theme/components/core/blocks/AddToCartSidebar/Model'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import ButtonComponent from 'theme/components/core/blocks/Button'
import LoaderBackground from 'theme/components/core/LoaderBackground'

export default {
  name: 'AddToCartSidebar',
  mixins: [ Composite, ProductOptionsMixin, ProductAddToCartMixin, ProductPriceMixin, ProductStockAlertMixin ],
  components: {
    Sidebar,
    DefaultSelector,
    BundleSelector,
    Model,
    MaterialIcon,
    ButtonComponent,
    LoaderBackground
  },
  props: {
    showAddToCartButton: {
      type: Boolean,
      default: false
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      selectedOption: undefined,
      loading: false,
      userSelection: false,
      disableSelection: false,
      quantity: 0
    }
  },
  async mounted () {
    this.setSelectedOptionByCurrentConfiguration()
  },
  computed: {
    ...mapGetters({
      product: 'product/getCurrentProduct',
      configuration: 'product/getCurrentProductConfiguration',
      isCurrentBundleOptionsSelection: 'product/isCurrentBundleOptionsSelection',
      options: 'product/getCurrentProductOptions',
      isAddingToCart: 'cart/getIsAdding'
    }),
    isAddToCartDisabled () {
      if (this.isBundle) {
        return this.$v.$invalid || this.loading || !this.isCurrentBundleOptionsSelection
      }
      return !this.userSelection || this.$v.$invalid || this.loading || !this.quantity
    },
    hasConfiguration () {
      return this.configuration && Object.keys(this.configuration).length > 0 && this.userSelection
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
        this.userSelection = true

        // We need to set the new configuration here already to enable the loading state for the selected option
        this.$store.dispatch('product/updateConfiguration', { option })
        this.setSelectedOptionByCurrentConfiguration()

        const configuration = Object.assign({ attribute_code: option.type }, option)
        await filterChangedProduct(configuration, this.$store, this.$router)

        this.$bus.$emit('user-has-selected-product-variant')

        if (this.closeOnSelect) {
          this.loading = false
          this.close()
        } else {
          await this.getQuantity()
          this.loading = false
        }
      } else {
        this.selectedOption = option
        this.addProductStockAlert(option)
      }
    },
    onBundleSelect (option) {
      if (this.closeOnSelect) {
        this.close()
      }

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
    },
    addToCartButtonClick () {
      if (this.showAddToCartButton && !this.loading && !this.isAddingToCart) {
        if (this.hasConfiguration || (this.isBundle && this.isCurrentBundleOptionsSelection)) {
          this.disableSelection = true
          this.addToCart(this.product)
            .then(() => { this.afterAddToCart() })
            .catch(() => { this.afterAddToCart() })
        }
      }
    },
    afterAddToCart () {
      this.disableSelection = false
      this.close(false)
    },
    close (dispatchSidebarClose = true) {
      if (dispatchSidebarClose) {
        this.$store.dispatch('ui/setSidebar', { key: 'addtocart', status: false })
      }
      this.$emit('close')
    }
  }
}
</script>
