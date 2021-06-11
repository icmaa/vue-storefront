<template>
  <div v-if="products && products.length > 0" data-test-id="AdditionalProducts">
    <h3 v-text="$t('Take me with you')" class="t-w-full t-mb-2 t-font-light" />
    <div class="t-overflow-auto t-scrolling-touch t-hide-scrollbar t--mr-6 md:t-mr-0">
      <div class="t-flex t--mx-1 lg:t--mx-2 t-webkit-tap-transparent">
        <additional-product
          class="product t-cursor-pointer t-flex-fix t-px-1 lg:t-px-2 t-w-32"
          v-for="(product, i) in products"
          :key="i"
          :product="product"
          @add-to-cart="addToCart"
          @remove-from-cart="removeFromCart"
        />
      </div>
    </div>
  </div>
</template>

<script>

import config from 'config'
import { mapGetters } from 'vuex'
import { SearchQuery } from 'storefront-query-builder'
import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import addDefaultProductFilter from 'icmaa-catalog/helpers/defaultProductFilter'

import AdditionalProduct from 'theme/components/core/blocks/Checkout/AdditionalProducts/Product'

export default {
  name: 'AdditionalProducts',
  components: {
    AdditionalProduct
  },
  data () {
    return {
      products: []
    }
  },
  computed: {
    ...mapGetters({
      getJsonBlockByIdentifier: 'icmaaCmsBlock/getJsonBlockByIdentifier',
      separateSelectedVariant: 'category-next/separateSelectedVariantInProductList'
    }),
    productsConfigArray () {
      return this.getJsonBlockByIdentifier('checkout-additional-products')
    }
  },
  methods: {
    async addToCart (product) {
      try {
        this.$store.dispatch('ui/loader', true)
        await this.$store.dispatch('cart/addItem', { productToAdd: product })
      } catch (err) {
        this.$store.commit(
          types.SN_CART + '/' + types.CART_ADDING_ITEM,
          { isAdding: false }
        )

        const message = err instanceof Error ? err.message : err
        this.$store.dispatch('notification/spawnNotification', { type: 'error', message })
      }

      this.$store.dispatch('ui/loader', false)
    },
    async removeFromCart (product) {
      try {
        this.$store.dispatch('ui/loader', true)
        await this.$store.dispatch('cart/removeItem', { product })
      } catch (err) {
        const message = err instanceof Error ? err.message : err
        this.$store.dispatch('notification/spawnNotification', { type: 'error', message })
      }

      this.$store.dispatch('ui/loader', false)
    }
  },
  async mounted () {
    await this.$store.dispatch('icmaaCmsBlock/list', 'checkout-additional-products')

    const query = new SearchQuery()

    const options = { separateSelectedVariant: this.separateSelectedVariant }
    const { includeFields, excludeFields } = config.entities.productList
    addDefaultProductFilter(query, true)
    query.applyFilter({ key: 'sku', value: { 'in': this.productsConfigArray.map(p => p.sku) } })

    const products = await this.$store.dispatch(
      'product/findProducts',
      { query, includeFields, excludeFields, options }
    )

    this.products = products.items || []
  }
}
</script>
