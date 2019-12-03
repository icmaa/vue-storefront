<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="alarm_on">
      {{ $t('My product-alerts') }}
    </headline>
    <div>
      <template v-if="products.length > 0">
        <product v-for="(product, i) in products" :key="product.childId" :product="product.product[0]" :product-id="product.childId" :class="{ 't-border-b': stockItems.length !== i + 1 }" />
      </template>
      <template v-else>
        {{ $t('You have no product alerts') }}
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import i18n from '@vue-storefront/i18n'
import Product from 'theme/components/core/blocks/MyAccount/Product'

export default {
  name: 'MyProductAlerts',
  components: {
    Headline,
    Product
  },
  data () {
    return {
      productIds: []
    }
  },
  computed: {
    ...mapGetters({
      products: 'icmaaProductAlert/getProducts',
      stockItems: 'icmaaProductAlert/getStockItems'
    })
  },
  async mounted () {
    this.productIds = await this.$store.dispatch('icmaaProductAlert/fetchProductStockAlerts')

    this.productIds.forEach(async element => {
      await this.$store.dispatch('icmaaProductAlert/fetchProductsByProductId', {
        productId: element
      })
    })
  }
}
</script>
