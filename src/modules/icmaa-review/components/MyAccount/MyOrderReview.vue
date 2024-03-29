<template>
  <div>
    <div class="t-bg-white t-p-4">
      <Headline>
        {{ $t('Review order') }} {{ orderId }}
        <span
          v-if="order"
          class="t-ml-8 t-grow t-text-sm t-text-base-light lg:t-ml-4 lg:t-flex-fix"
        ># {{ order.increment_id }}</span>
      </Headline>
      <div class="t-text-sm t-text-base-tone">
        {{ $t('Write a product review of your last orders products.') }}
      </div>
    </div>
    <Product
      v-for="(product, i) in products"
      :key="i"
      :product="product"
      class="t-mt-4"
    />
  </div>
</template>

<script>
import { entities } from 'config'
import { mapGetters } from 'vuex'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { ReviewModule } from '@vue-storefront/core/modules/review'
import { IcmaaExtendedReviewModule } from 'icmaa-review'
import { SearchQuery } from 'storefront-query-builder'
import last from 'lodash-es/last'

import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import Product from 'icmaa-review/components/MyAccount/MyOrderReview/Product'

export default {
  name: 'MyOrderReview',
  components: {
    Headline,
    Product
  },
  data () {
    return {
      products: []
    }
  },
  computed: {
    ...mapGetters({
      ordersHistory: 'user/getOrdersHistory'
    }),
    orderId () {
      return this.$route.params.orderId || (this.ordersHistory.length > 0 ? this.ordersHistory[0].entity_id : false)
    },
    order () {
      return this.ordersHistory.find(order =>
        parseInt(order.entity_id) === parseInt(this.orderId)
      )
    },
    parentOrderItems () {
      if (!this.order) return []
      return this.order.items.filter((item) => {
        return !item.parent_item_id
      })
    }
  },
  watch: {
    async order () {
      this.products = await this.fetchProducts()
    }
  },
  beforeCreate () {
    registerModule(ReviewModule)
    registerModule(IcmaaExtendedReviewModule)
  },
  async mounted () {
    this.products = await this.fetchProducts()
  },
  methods: {
    async fetchProducts () {
      let { includeFields, excludeFields } = entities.productList

      let query = new SearchQuery()
      query.applyFilter({ key: 'id', value: { 'eq': this.parentOrderItems.map(i => i.product_id) } })

      return this.$store.dispatch('product/findProducts', { query, includeFields, excludeFields })
        .then(result => result.items)
    }
  }
}
</script>
