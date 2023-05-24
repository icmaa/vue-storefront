<template>
  <div
    v-if="loading || products && products.length > 0"
    data-test-id="AdditionalProducts"
  >
    <h3
      class="t-mb-2 t-w-full t-font-light"
      v-text="$t('Take me with you')"
    />
    <div class="t--mr-6 t-overflow-auto t-hide-scrollbar t-scrolling-touch md:t-mr-0">
      <div class="t--mx-1 t-flex t-webkit-tap-transparent lg:t--mx-2">
        <template v-if="loading">
          <div
            v-for="i in 4"
            :key="`placeholder-${i}`"
            class="t-w-32 t-flex-fix t-px-1 lg:t-px-2"
          >
            <Placeholder
              ratio="30:43"
              :plain="false"
              class="t-mb-3 t-bg-base-lightest"
            />
            <div class="t-my-2 t-h-2 t-w-10/12 t-bg-base-lightest t-leading-tight" />
            <div class="t-my-2 t-h-2 t-w-2/3 t-bg-base-lightest t-leading-tight" />
            <div class="t-my-2 t-mt-4 t-h-2 t-w-1/3 t-bg-base-lightest t-leading-tight" />
          </div>
        </template>
        <AdditionalProduct
          v-for="(product, i) in products"
          :key="i"
          class="product t-w-32 t-flex-fix t-cursor-pointer t-px-1 lg:t-px-2"
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

import Placeholder from 'theme/components/core/blocks/Placeholder'
import AdditionalProduct from 'theme/components/core/blocks/Checkout/AdditionalProducts/Product'

export default {
  name: 'AdditionalProducts',
  components: {
    Placeholder,
    AdditionalProduct
  },
  data () {
    return {
      loading: true,
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
  async mounted () {
    await this.$store.dispatch('icmaaCmsBlock/list', 'checkout-additional-products')
    const skus = this.productsConfigArray.map(p => p.sku)

    const query = new SearchQuery()
    addDefaultProductFilter(query)
    query.applyFilter({ key: 'sku', value: { 'in': skus } })

    const { includeFields, excludeFields } = config.entities.productList
    const options = {
      separateSelectedVariant: this.separateSelectedVariant,
      assignProductConfiguration: true,
      setConfigurableProductOptions: true,
      filterUnavailableVariants: true
    }

    let products = await this.$store.dispatch(
      'product/findProducts',
      { query, includeFields, excludeFields, options }
    )

    products = products.items || []
    products = products.sort((a, b) => skus.indexOf(a.sku) - skus.indexOf(b.sku))

    this.products = products
    this.loading = false
  },
  methods: {
    async addToCart (product) {
      try {
        this.$store.dispatch('ui/loader', true)

        /**
         * To add a product to cart, its important to assign the `selectedVariant` to the `productToAdd`
         * parameter. To have a ready configured product you'll need to fetch them using the `catalog/findProducts`
         * action with the `separateSelectedVariant`, `assignProductConfiguration` & `setConfigurableProductOptions`
         * parameters set to true. You could also set use `separateSelectedVariant` to false and use the returned
         * product but this might lead into wrong data displayed as the product-data is the data for the child.
         * `setConfigurableProductOptions` is defining the configurable options if it has some and
         * `assignProductConfiguration` will assign this configs to the `configuration` property of the product DTO.
         * You can find more info and logic inside the `configureProductAsync` method.
         */
        const { selectedVariant } = product
        const productToAdd = Object.assign({}, product, selectedVariant)

        await this.$store.dispatch('cart/addItem', { productToAdd })
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
  }
}
</script>
