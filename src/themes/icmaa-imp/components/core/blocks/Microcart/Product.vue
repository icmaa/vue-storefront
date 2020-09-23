<template>
  <li class="t-flex t-py-2 t-border-b t-border-base-lightest" :class="{ 't-opacity-75': loading }" data-test-id="MicroCartProduct">
    <div class="t-w-1/3 t-mr-4">
      <router-link :to="productLink" @click.native="$store.dispatch('ui/setSidebar', { key: 'microcart', status: false })">
        <product-image :image="thumbnail" :alt="product.name | htmlDecode" />
      </router-link>
    </div>

    <div class="t-w-2/3 t-flex t-flex-col t-py-2">
      <div class="t-mb-4 t-leading-tight">
        <router-link class="t-text-primary t-text-sm" :to="productLink" data-test-id="productLink" @click.native="$store.dispatch('ui/setSidebar', { key: 'microcart', status: false })">
          {{ translatedProductName | htmlDecode }}
        </router-link>
      </div>

      <div class="t-flex-grow">
        <div class="t-flex t-w-full t-flex-wrap t-items-center t-mb-2" v-if="totals.length > 0 || isFree">
          <button-component class="t-mr-2 t-mb-2" type="tag" size="xs" :cursor-pointer="false" v-for="opt in totals" :key="opt.label">
            {{ opt.value }}
          </button-component>
          <div class="t-text-xs t-text-sale t-font-bold t-uppercase" v-if="isFree">
            {{ $t('Free') }}
          </div>
        </div>

        <div class="t-text-sm" v-if="hasProductErrors">
          {{ product.errors | formatProductMessages }}
        </div>
      </div>

      <div class="t-w-full t-text-sm t-mb-4" v-if="product.totals">
        <template v-if="product.totals.discount_amount">
          <span class="t-text-base-light t-line-through t-mr-2">
            {{ product.totals.row_total_incl_tax | price }}
          </span>
          <span class="t-text-sale t-font-bold">
            {{ (product.totals.row_total - product.totals.discount_amount + product.totals.tax_amount) | price }}
          </span>
        </template>
        <template v-else>
          <span class="price-original t-text-base-light t-line-through t-mr-2" v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0">
            {{ product.original_price_incl_tax | price }}
          </span>
          <span class="price-special t-text-sale t-font-bold" v-if="product.special_price && parseFloat(product.special_price) > 0">
            {{ product.price_incl_tax | price }}
          </span>
          <span class="price t-text-base-dark t-font-bold" v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0">
            {{ product.price_incl_tax | price }}
          </span>
        </template>
      </div>

      <div class="t-flex t-items-center t-flex-wrap t-justify-between t-text-base-light" v-if="!isFree">
        <div class="t-flex t-items-center">
          <base-select
            class="t-w-16 t-text-base-tone"
            size="sm"
            name="qty"
            :id="`qty-${product.id}`"
            :options="qtyOptions"
            :value="productQty"
            :disabled="loading || isAddingToCart"
            :loading="loading || isAddingToCart"
            @change="updateQty"
            v-if="!isFree"
          />
          <label :for="`#qty-${product.id}`" class="t-ml-2 t-text-sm t-text-base-tone">{{ $t('Pcs.') }}</label>
        </div>
        <button-component type="transparent" :size="'sm'" :icon="'remove_shopping_cart'" :icon-only="true" @click="removeItem">
          {{ $t('Delete') }}
        </button-component>
      </div>
    </div>
  </li>
</template>

<script>
import config from 'config'
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { productThumbnailPath } from '@vue-storefront/core/helpers'
import { formatProductLink } from 'icmaa-url/helpers'
import Product from '@vue-storefront/core/compatibility/components/blocks/Microcart/Product'
import ProductNameMixin from 'icmaa-catalog/mixins/ProductNameMixin'
import ProductImage from 'theme/components/core/ProductImage'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import ButtonComponent from 'theme/components/core/blocks/Button'

import last from 'lodash-es/last'

export default {
  name: 'MicroCartProduct',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    ButtonComponent,
    BaseSelect,
    ProductImage
  },
  mixins: [Product, ProductNameMixin],
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      freeCartItems: 'cart/getFreeCartItems',
      getOptionLabel: 'attribute/getOptionLabel',
      getAttributeLabel: 'attribute/getAttributeLabel',
      isAddingToCart: 'cart/getIsAdding'
    }),
    hasProductInfo () {
      return this.product.info && Object.keys(this.product.info).length > 0
    },
    hasProductErrors () {
      return this.product.errors && Object.keys(this.product.errors).length > 0
    },
    isTotalsActive () {
      return this.isOnline && !this.editMode && this.product.totals && this.product.totals.options
    },
    thumbnail () {
      return productThumbnailPath(this.product)
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    productQty () {
      return this.product.qty
    },
    qtyOptions () {
      const limit = (this.productQty >= 5 ? this.productQty + 5 : 5)
      let options = []
      for (let value = 1; value <= limit; value++) {
        options.push({ label: value, value, selected: this.productQty === value })
      }
      return options
    },
    totals () {
      if (this.isTotalsActive) {
        return this.product.totals.options
      } else if (this.customProductOptions) {
        return this.customProductOptions
      }
      return []
    },
    customProductOptions () {
      return this.getCustomProductOptions(this.product)
    },
    isFree () {
      return this.freeCartItems.includes(this.product.sku)
    }
  },
  methods: {
    getCustomProductOptions (product) {
      if (product.product_option) {
        const { configurable_item_options, custom_options, bundle_options } = product.product_option.extension_attributes
        if (product.type_id === 'configurable') {
          /**
           * The `populateProductConfigurationAsync()` method already populate option label
           * and value into state for configurable product – nothing to do here.
           */
          return this.product.options
        } else if (product.type_id === 'bundle') {
          let options = []
          this.product.bundle_options.forEach(option => {
            bundle_options[option.option_id].option_selections.forEach(id => {
              const productLink = option.product_links.find(productLink => productLink.id === id)
              if (option.configurable_options && option.configurable_options.length > 0) {
                const attributeKey = option.configurable_options[0]['attribute_code']
                options.push({
                  label: this.getAttributeLabel({ attributeKey }),
                  value: this.getOptionLabel({ attributeKey, optionId: productLink[attributeKey] })
                })
              } else {
                options.push({
                  label: option.title,
                  value: this.trimLongBundleName(productLink.product.name)
                })
              }
            })
          })

          return options
        }
      }

      return []
    },
    trimLongBundleName (name) {
      if (name.length > 45) {
        name = last(name.split(' - '))
      }
      return name
    },
    async updateQty (qty) {
      this.loading = true
      return this.$store.dispatch('cart/updateQuantity', { product: this.product, qty })
        .then(() => { this.loading = false })
    },
    async removeFromCart () {
      this.$store.dispatch('cart/removeItem', { product: this.product })
    }
  }
}
</script>
