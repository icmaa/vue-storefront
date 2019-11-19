<template>
  <div class="t-p-4 t-bg-white" v-if="order">
    <!-- My order header -->
    <headline icon="local_mall">
      {{ $t('Order #') }}{{ order.increment_id }}
    </headline>

    <!-- <a href="#" class="t-align-right t-text-base-light" @click.prevent="remakeOrder(singleOrderItems)">{{ $t('Remake order') }}</a>-->
    <div class="t-flex t-flex-wrap t-justify-between t-bg-base-lightest t-rounded-sm t-text-sm t-p-2 t-mb-4">
      <div class="t-flex">
        <div class="t-w-full t-flex t-items-center t-py-1">
          <div>
            <strong>{{ $t('Status') }}</strong>
          </div>
          <status-icon :status="order.status" />
          <div>{{ order.status | capitalize }}</div>
        </div>
      </div>
      <div class="t-py-2">
        <strong>{{ $t('Order date') }}</strong> {{ order.created_at | date('LLL') }}
      </div>
    </div>

    <!-- Order information -->
    <div class="t-text-sm">
      <div class="t-text-lg t-py-2">
        {{ $t('Order informations') }}
      </div>
      <div class="t-flex t-flex-wrap">
        <div class="t-w-full sm:t-w-1/2 t-mb-4 sm:t-pr-4">
          <div class="t-border-b">
            <strong>{{ $t('Billing address') }}</strong>
          </div>
          <p>{{ billingAddress.firstname }} {{ billingAddress.lastname }}</p>
          <p>{{ billingAddress.street[0] }} {{ billingAddress.street[1] }}</p>
          <p>{{ billingAddress.postcode }} {{ billingAddress.city }}</p>
          <p>{{ billingAddress.country }}</p>
        </div>
        <div class="t-w-full sm:t-w-1/2 t-mb-4 sm:t-pr-4">
          <div class="t-border-b">
            <strong>{{ $t('Shipping address') }}</strong>
          </div>
          <p>{{ shippingAddress.firstname }} {{ shippingAddress.lastname }}</p>
          <p>{{ shippingAddress.street[0] }} {{ shippingAddress.street[1] }}</p>
          <p>{{ shippingAddress.postcode }} {{ shippingAddress.city }}</p>
          <p>{{ shippingAddress.country }}</p>
        </div>
        <div class="t-w-full sm:t-w-1/2 t-mb-4 sm:t-pr-4">
          <div class="t-border-b">
            <strong>{{ $t('Shipping method') }}</strong>
          </div>
          <p>{{ order.shipping_description }}</p>
        </div>
        <div class="t-w-full sm:t-w-1/2 t-mb-4 sm:t-pr-4">
          <div class="t-border-b">
            <strong>{{ $t('Payment method') }}</strong>
          </div>
          <p>{{ paymentMethod }}</p>
        </div>
      </div>
    </div>

    <!-- products -->
    <div class="t-text-lg t-py-2 t-mb-4">
      {{ $t('Items ordered') }}
    </div>
    <div class="t-w-full t-flex t-mb-2 t-pb-2 t-border-b t-rounded-sm t-border-base-lightest" v-for="item in singleOrderItems" :key="item.item_id">
      <div class="t-w-1/3 sm:t-w-1/6 t-mr-4">
        <product-image :image="{ src: getThumbnail(item.thumbnail, 20, 20), loading: getThumbnail(item.thumbnail, 20, 20) }" />
      </div>
      <div class="t-w-2/3 t-py-2">
        <div class="t-block t-text-primary t-w-full t-text-sm t-leading-tight t-mb-2" :data-div="$t('Product Name')">
          {{ item.qty_ordered }} x {{ item.name }}
        </div>
        <div class="t-font-bold" :data-div="$t('Subtotal')">
          {{ item.row_total_incl_tax | price }}
        </div>
      </div>
    </div>

    <!-- order price -->
    <div class="t-bg-base-lightest t-p-4 t-text-sm t-rounded-sm">
      <div class="t-w-full t-text-right">
        <div class="t-flex t-justify-between sm:t-justify-end">
          <span class="t-w-1/2 sm:t-w-1/3">{{ $t('Subtotal') }}</span>
          <span class="t-w-1/2 sm:t-w-1/3">{{ order.subtotal | price }}</span>
        </div>
        <div class="t-flex t-justify-between sm:t-justify-end">
          <span class="t-w-1/2 sm:t-w-1/3">{{ $t('Shipping') }}</span>
          <span class="t-w-1/2 sm:t-w-1/3">{{ order.shipping_amount | price }}</span>
        </div>
        <div class="t-flex t-justify-between sm:t-justify-end">
          <span class="t-w-1/2 sm:t-w-1/3">{{ $t('Tax') }}</span>
          <span class="t-w-1/2 sm:t-w-1/3">{{ (order.tax_amount + order.discount_tax_compensation_amount) | price }}</span>
        </div>
        <div v-if="order.discount_amount" class="t-flex t-justify-between sm:t-justify-end">
          <span class="t-w-1/2 sm:t-w-1/3">{{ $t('Discount') }}</span>
          <span class="t-w-1/2 sm:t-w-1/3">{{ order.discount_amount | price }}</span>
        </div>
        <div class="t-flex t-justify-between sm:t-justify-end t-font-bold">
          <span class="t-w-1/2 sm:t-w-1/3">{{ $t('Grand total') }}</span>
          <span class="t-w-1/2 sm:t-w-1/3">{{ order.grand_total | price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import MyOrder from '@vue-storefront/core/compatibility/components/blocks/MyAccount/MyOrder'
import ProductImage from 'theme/components/core/ProductImage'
import { getThumbnailPath, productThumbnailPath } from '@vue-storefront/core/helpers'
import { mapActions } from 'vuex'
import StatusIcon from 'theme/components/core/blocks/MyAccount/StatusIcon.vue'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'

export default {
  mixins: [MyOrder],
  components: {
    ProductImage,
    Headline,
    StatusIcon
  },
  data () {
    return {
      itemThumbnail: []
    }
  },
  methods: {
    ...mapActions({
      getProduct: 'product/single'
    })
  },
  computed: {
    thumbnail () {
      return this.getThumbnail(this.singleOrderItems[0].thumbnail, 150, 150)
    },
    productLink () {
      const product = this.getProduct({ options: { sku: this.singleOrderItems[0].sku }, setCurrentProduct: false, setCurrentCategoryPath: false, selectDefaultVariant: false })
      return product
      // return formatProductLink(product, currentStoreView().storeCode)
    }
  },
  mounted () {
    this.singleOrderItems.forEach(async item => {
      const product = await this.getProduct({ options: { sku: item.sku }, setCurrentProduct: false, setCurrentCategoryPath: false, selectDefaultVariant: false })
      Vue.set(this.itemThumbnail, item.sku, product)
    })
  }
}
</script>
