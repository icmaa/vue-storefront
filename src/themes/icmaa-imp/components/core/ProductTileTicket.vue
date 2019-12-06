<template>
  <router-link :to="productLink" tag="tr" class="t-border-b t-border-t-0 t-border-l-0 t-border-r-0 t-border-solid t-border-black">
    <td class="t-w-1/2 t-px-4 t-py-2  block md:t-table-cell">
      {{ translatedProductName | htmlDecode }}
    </td>
    <td class="t-w-1/10 t-px-4 t-py-2  block md:t-table-cell">
      {{ product.stock.is_in_stock }}
    </td>
    <td class="t-w-1/10 t-px-4 t-py-2  block md:t-table-cell">
      {{ product.ticket_city }}<br>{{ product.ticket_venue }}
    </td>
    <td class="t-w-1/10 t-px-4 t-py-2  block md:t-table-cell">
      {{ product.ticket_eventdate }}<br>{{ product.ticket_start }}
    </td>
    <td class="t-w-1/10 t-px-4 t-py-2  block md:t-table-cell">
      <p>
        <span class="price-original t-text-base-light t-line-through t-mr-2" v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0">
          {{ product.original_price_incl_tax | price }}
        </span>
        <span class="price-special t-text-sale t-font-bold" v-if="product.special_price && parseFloat(product.special_price) > 0">
          <span v-if="hasMultiplePrices" v-text="$t('as low as')" />
          {{ product.price_incl_tax | price }}
        </span>
        <span class="price t-text-base-dark t-font-bold" v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0">
          <span v-if="hasMultiplePrices" v-text="$t('as low as')" />
          {{ product.price_incl_tax | price }}
        </span>
      </p>
    </td>
    <td class="t-w-1/10 t-px-4 t-py-2  block md:t-table-cell">
      <button type="button" class="t-flex t-items-center t-rounded-sm t-cursor-pointer t-webkit-tap-transparent t-flex-grow disabled:t-opacity-75 t-relative t-uppercase t-h-10 t-px-4 t-text-xs t-bg-primary t-text-white t-justify-center">
        <i class="t-flex t-flex-fix material-icons t-text-2xl">info</i>
      </button>
    </td>
  </router-link>
</template>

<script>
import config from 'config'
import rootStore from '@vue-storefront/core/store'
import PromoBanner from 'theme/components/core/blocks/Category/PromoBanner'
import ProductNameMixin from 'icmaa-catalog/mixins/ProductNameMixin'
import ProductPriceMixin from 'theme/mixins/product/priceMixin'
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile'

export default {
  mixins: [ProductTile, ProductNameMixin, ProductPriceMixin],
  components: {
    PromoBanner
  },
  props: {
    labelsActive: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onProductPriceUpdate (product) {
      if (product.sku === this.product.sku) {
        Object.assign(this.product, product)
      }
    },
    visibilityChanged (isVisible, entry) {
      if (
        isVisible &&
        config.products.configurableChildrenStockPrefetchDynamic &&
        config.products.filterUnavailableVariants &&
        this.product.type_id === 'configurable' &&
        this.product.configurable_children &&
        this.product.configurable_children.length > 0
      ) {
        const skus = [this.product.sku]
        for (const confChild of this.product.configurable_children) {
          const cachedItem = rootStore.state.stock.cache[confChild.id]
          if (typeof cachedItem === 'undefined' || cachedItem === null) {
            skus.push(confChild.sku)
          }
        }
        if (skus.length > 0) {
          rootStore.dispatch('stock/list', { skus: skus }) // store it in the cache
        }
      }
    }
  },
  beforeMount () {
    this.$bus.$on('product-after-priceupdate', this.onProductPriceUpdate)
  },
  beforeDestroy () {
    this.$bus.$off('product-after-priceupdate', this.onProductPriceUpdate)
  }

}
</script>
