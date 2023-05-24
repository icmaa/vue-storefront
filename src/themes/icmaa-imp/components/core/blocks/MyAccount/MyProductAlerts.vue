<template>
  <div>
    <div class="t-bg-white t-p-4">
      <Headline class="t-mb-0">
        {{ $t('My product-alerts') }}
      </Headline>
      <div
        v-if="stockItems.length === 0"
        class="t-text-sm t-text-base-light"
      >
        {{ $t('You aren\'t subscribed to any product alerts.') }}
      </div>
      <div
        v-if="isLoaded && stockItems.length > 0"
        class="t-text-sm t-text-base-tone"
      >
        {{ $t('You\'re subscribed to the following products and will be notified as soon as they are back in stock.') }}
      </div>
    </div>
    <template v-if="isLoaded && stockItems.length > 0">
      <div class="t--mx-1 t-mt-4 t-flex t-flex-wrap t-justify-start lg:t--mx-2">
        <Product
          v-for="(stockItemId, i) in stockItems"
          :key="i"
          :stock-item-id="stockItemId"
          class="t-mb-8 t-w-1/2 t-px-1 lg:t-w-1/3 lg:t-px-2"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import i18n from '@vue-storefront/i18n'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import Product from 'theme/components/core/blocks/MyAccount/MyProductAlerts/Product'

export default {
  name: 'MyProductAlerts',
  components: {
    Headline,
    Product
  },
  data () {
    return {
      isLoaded: false
    }
  },
  computed: {
    ...mapGetters({
      stockItems: 'icmaaProductAlert/getStockItems',
      products: 'icmaaProductAlert/getProducts'
    }),
    attributeCodes () {
      let attributeCodes = []
      this.products.forEach(p => {
        p.configurable_options.forEach(ch => {
          if (!attributeCodes.includes(ch.attribute_code)) {
            attributeCodes.push(ch.attribute_code)
          }
        })
      })

      return attributeCodes
    }
  },
  async beforeMount () {
    await this.$store.dispatch('icmaaProductAlert/fetchProductStockAlerts')
    await this.$store.dispatch('icmaaProductAlert/fetchParentProductsByStockIds', this.stockItems)
    await this.$store.dispatch('attribute/list', { filterValues: this.attributeCodes })
    this.isLoaded = true
  }
}
</script>
