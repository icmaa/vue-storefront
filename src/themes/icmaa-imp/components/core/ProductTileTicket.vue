<template>
  <router-link :to="productLink" tag="li" class="t-flex t-flex-wrap t-px-2 t-bg-white t-py-4 t-cursor-pointer">
    <div class="t-w-full md:t-w-5/12 t-px-2 t-mb-3 md:t-mb-3 t-flex-grow t-text-primary">
      {{ translatedProductName | htmlDecode }} <span class="t-float-right t-clearfix">{{ ticketStockStatus }}</span>
    </div>
    <div class="t-w-full md:t-w-3/12 t-px-2">
      <div class="" v-text="product.ticket_city" />
      <div class="t-uppercase t-text-base-light" v-text="product.ticket_venue" />
    </div>
    <div class="t-w-full  md:t-w-2/12 t-px-2">
      {{ ticketEventdate }}
      <div class="t-inline md:t-block">
        {{ product.ticket_start }}
      </div>
    </div>
    <div class="t-w-10/12 md:t-w-1/12 t-px-2 t-text-right">
      <p>
        <span class="price-original t-text-base-light t-line-through t-mr-2" v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0">
          {{ price(product.original_price_incl_tax) }}
        </span>
        <span class="price-special t-text-sale t-font-bold" v-if="product.special_price && parseFloat(product.special_price) > 0">
          <span v-if="hasMultiplePrices" v-text="$t('as low as')" />
          {{ price(product.price_incl_tax) }}
        </span>
        <span class="price t-text-base-dark t-font-bold" v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0">
          <span v-if="hasMultiplePrices" v-text="$t('as low as')" />
          {{ price(product.price_incl_tax) }}
        </span>
      </p>
    </div>
    <div class="t-w-2/12 md:t-w-1/12 t-px-2 t-flex-1 t-self-center">
      <button-component type="transparent" icon="keyboard_arrow_right" :icon-only="true">
        {{ $t('Show product') }}
      </button-component>
    </div>
  </router-link>
</template>

<script>
import config from 'config'
import rootStore from '@vue-storefront/core/store'
import ButtonComponent from 'theme/components/core/blocks/Button'
import ProductNameMixin from 'icmaa-catalog/mixins/ProductNameMixin'
import ProductPriceMixin from 'theme/mixins/product/priceMixin'
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile'
import { toDate } from 'icmaa-config/helpers/datetime'

export default {
  mixins: [ProductTile, ProductNameMixin, ProductPriceMixin],
  components: {
    ButtonComponent
  },
  props: {
    labelsActive: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ticketEventdate () {
      return toDate(this.product.ticket_eventdate)
    },
    ticketStockStatus () {
      return this.product.stock.is_in_stock
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
