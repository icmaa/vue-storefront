<template>
  <div class="t-p-4 t-bg-white" v-if="order">
    <!-- My order header -->
    <headline icon="local_mall">
      {{ $t('Order #') }}{{ order.increment_id }}
    </headline>

    <!-- Order status -->
    <div class="t-flex t-flex-wrap t-justify-between t-border-b t-text-sm t-p-2 t-mb-8">
      <div class="t-py-2">
        <div class="t-font-bold">
          {{ $t('Order date') }}
        </div>
        {{ order.created_at | date('LLL') }}
      </div>
      <div class="t-w-1/3 t-py-2">
        <div class="t-font-bold">
          {{ $t('Status') }}
        </div>
        <div class="t-flex t-items-center">
          <status-icon :status="order.status" />
          {{ order.status | capitalize }}
        </div>
      </div>
      <div class="t-w-full t-flex t-flex-wrap t-justify-between t-mb-2">
        <tracking-link :order-id="order.id" :status="order.status" class="t-my-2 t-mr-2">
          <button-component type="second" icon="local_shipping" :icon-only="false" class="t-flex-fix">
            {{ $t('Shipment tracking') }}
          </button-component>
        </tracking-link>
        <button-component type="primary" :icon="false" @click="remakeOrder(singleOrderItems)" class="t-flex-fix t-my-2 t-mr-2">
          {{ $t('Remake order') }}
        </button-component>
      </div>
      <a :href="service" class="t-block t-w-full t-font-hairline">{{ $t('Are there any questions left?') }}</a>
    </div>

    <!-- Order information -->
    <div class="t-text-sm t-mb-8">
      <div class="t-block t-text-2xl t-font-thin t-leading-relaxed t-mb-2">
        {{ $t('Order informations') }}
      </div>
      <div class="t-flex t-flex-wrap">
        <div class="t-w-full sm:t-w-1/2 t-mb-4 sm:t-pr-4">
          <div class="t-border-b t-font-bold">
            {{ $t('Billing address') }}
          </div>
          <p>{{ billingAddress.firstname }} {{ billingAddress.lastname }}</p>
          <p>{{ billingAddress.street[0] }} {{ billingAddress.street[1] }}</p>
          <p>{{ billingAddress.postcode }} {{ billingAddress.city }}</p>
          <p>{{ billingAddress.country }}</p>
        </div>
        <div class="t-w-full sm:t-w-1/2 t-mb-4 sm:t-pr-4">
          <div class="t-border-b t-font-bold">
            {{ $t('Shipping address') }}
          </div>
          <p>{{ shippingAddress.firstname }} {{ shippingAddress.lastname }}</p>
          <p>{{ shippingAddress.street[0] }} {{ shippingAddress.street[1] }}</p>
          <p>{{ shippingAddress.postcode }} {{ shippingAddress.city }}</p>
          <p>{{ shippingAddress.country }}</p>
        </div>
        <div class="t-w-full sm:t-w-1/2 t-mb-4 sm:t-pr-4">
          <div class="t-border-b t-font-bold">
            {{ $t('Shipping method') }}
          </div>
          <p>{{ order.shipping_description }}</p>
        </div>
        <div class="t-w-full sm:t-w-1/2 t-mb-4 sm:t-pr-4">
          <div class="t-border-b t-font-bold">
            {{ $t('Payment method') }}
          </div>
          <p>{{ paymentMethod }}</p>
        </div>
      </div>
    </div>

    <!-- product list -->
    <div class="t-block t-text-2xl t-font-thin t-leading-relaxed t-mb-2">
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
        <button-component v-for="(option, key) in parseProductOptions(item.product_options)" :key="key" class="t-mr-2 t-mb-2" type="tag" size="sm" :cursor-pointer="false">
          {{ option }}
        </button-component>
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
import TrackingLink from 'icmaa-tracking/components/TrackingLink'
import ProductImage from 'theme/components/core/ProductImage'
import { getThumbnailPath, productThumbnailPath } from '@vue-storefront/core/helpers'
import { mapActions } from 'vuex'
import StatusIcon from 'theme/components/core/blocks/MyAccount/StatusIcon.vue'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import ButtonComponent from 'theme/components/core/blocks/Button'
import { mapGetters } from 'vuex'

export default {
  mixins: [MyOrder],
  components: {
    ProductImage,
    Headline,
    StatusIcon,
    TrackingLink,
    ButtonComponent
  },
  computed: {
    ...mapGetters('icmaaCmsBlock', ['getJsonBlockByIdentifier']),
    service () {
      const metaNavigation = this.getJsonBlockByIdentifier('navigation-meta').find(el => el.name === 'Service') || { route: '/service' }
      return `/${currentStoreView().storeCode}${metaNavigation.route}`
    }
  },
  methods: {
    parseProductOptions (options) {
      if (options) {
        const regex = /(?<="value";s:\d+:")[^"]*/
        const match = regex.exec(options)
        return match === null ? [] : match
      }
      return []
    }
  }
}
</script>
