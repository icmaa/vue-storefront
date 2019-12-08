<template>
  <router-link :to="productLink" tag="li" class="t-border-b-2 t-border-t-0 t-border-l-o t-border-r-0 t-flex">
    <div class="t-flex">
      {{ translatedProductName | htmlDecode }} {{ product.stock.is_in_stock }}
    </div>
    <div class="t-flex">
      {{ product.ticket_city }}<br><span class="t-uppercase t-text-gray-500">{{ product.ticket_venue }}</span>
    </div>
    <div class="t-flex">
      {{ ticket_eventdate }}<br>{{ product.ticket_start }}
    </div>
    <div class="t-flex">
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
    </div>
    <div class="t-flex">
      <button type="button" class="t-flex t-items-center t-rounded-sm t-cursor-pointer t-webkit-tap-transparent t-flex-grow disabled:t-opacity-75 t-relative t-uppercase t-h-10 t-px-4 t-text-xs t-bg-primary t-text-white t-justify-center">
        <i class="t-flex t-flex-fix material-icons t-text-2xl">info</i>
      </button>
    </div>
  </router-link>
</template>

<script>
import config from 'config'
import rootStore from '@vue-storefront/core/store'
import PromoBanner from 'theme/components/core/blocks/Category/PromoBanner'
import ProductNameMixin from 'icmaa-catalog/mixins/ProductNameMixin'
import ProductPriceMixin from 'theme/mixins/product/priceMixin'
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile'
import { toDate } from 'icmaa-config/helpers/datetime'

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
  computed: {
    ticket_eventdate () {
      return toDate(this.product.ticket_eventdate)
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
