<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="alarm_on">
      {{ $t('My product-alerts') }}
    </headline>
    <div>
      <template v-if="isLoaded && stockItems.length > 0">
        <product v-for="(stockItemId, i) in stockItems" :key="i" :stock-item-id="stockItemId" />
      </template>
      <div class="t-text-sm t-text-base-light" v-if="isLoaded && stockItems.length === 0">
        {{ $t('You aren\'t subscribed to any product alerts.') }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import i18n from '@vue-storefront/i18n'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import Product from 'theme/components/core/blocks/MyAccount/Product'

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
  async created () {
    await this.$store.dispatch('icmaaProductAlert/fetchProductStockAlerts')
    await this.$store.dispatch('icmaaProductAlert/fetchParentProductsByStockIds', this.stockItems)
    await this.$store.dispatch('attribute/list', { filterValues: this.attributeCodes })
    this.isLoaded = true
  }
}
</script>
