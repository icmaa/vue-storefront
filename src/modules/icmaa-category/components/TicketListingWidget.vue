<template>
  <div
    data-test-id="TicketListingWidget"
    class="product-listing t-flex t-flex-wrap t-justify-start "
    :class="[ appearance ] "
  >
    <template v-for="(product) in products">
      <ProductTileTicket
        :key="`product-${product.sku}`"
        :product="product"
        class="t-mb-1 t-w-full t-px-1 lg:t-px-2"
      />
    </template>
  </div>
</template>

<script>
import ProductTileTicket from 'theme/components/core/ProductTileTicket.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'TicketListingWidget',
  components: {
    ProductTileTicket
  },
  props: {
    columns: {
      type: [Number, String],
      default: 1
    },
    limit: {
      type: [Number, String],
      default: 16
    },
    categoryId: {
      type: Number,
      required: true
    },
    sort: {
      type: String,
      default: 'ticket_eventdate:asc'
    },
    appearance: {
      type: String,
      default: 't-px-3 lg:t-px-4'
    }
  },
  computed: {
    ...mapGetters('icmaaCategory', ['getProductListingWidget']),
    ...mapGetters({
      cluster: 'user/getCluster',
      getUserSessionData: 'user/getSessionData'
    }),
    options () {
      return {
        categoryId: this.categoryId,
        sort: this.sort,
        size: this.limit
      }
    },
    products () {
      const products = this.getProductListingWidget(this.options)
      if (!products) return []
      return products.list.slice(0, this.limit)
    },
    gender () {
      return this.getUserSessionData('gender')
    }
  },
  watch: {
    cluster () {
      this.fetchProducts(true)
    },
    gender () {
      this.fetchProducts(true)
    }
  },
  mounted () {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts (reload = false) {
      await this.$store.dispatch(
        'icmaaCategory/loadProductListingWidgetProducts',
        { ...this.options, reload }
      )
    }
  }
}
</script>
