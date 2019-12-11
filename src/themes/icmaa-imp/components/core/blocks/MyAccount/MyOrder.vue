<template>
  <div>
    <div class="t-p-4 t-bg-white t-mb-4" v-if="order">
      <headline icon="local_mall">
        {{ $t('Order') }}
        <span v-if="order" class="t-text-sm t-text-base-light t-flex-grow lg:t-flex-fix t-ml-4"># {{ order.increment_id }}</span>
      </headline>
      <div class="t-flex t-flex-wrap t-justify-between t-text-sm t-text-base-tone">
        <div class="t-w-1/2 lg:t-w-1/4 t-mb-4 lg:t-mb-0">
          <div class="t-font-bold t-mb-1 t-text-base-lighter t-text-xxs t-uppercase">
            {{ $t('Date') }}
          </div>
          {{ order.created_at | date }}
        </div>
        <div class="t-w-1/2 lg:t-w-1/4 t-mb-4 lg:t-mb-0">
          <div class="t-font-bold t-mb-1 t-text-base-lighter t-text-xxs t-uppercase">
            {{ $t('Status') }}
          </div>
          <status-icon :status="order.status">
            {{ $t(`orderStatus_${order.status}`) }}
          </status-icon>
        </div>
        <div class="t-w-full lg:t-w-2/4 t-flex t-flex-wrap t-items-center t-justify-between lg:t-justify-end">
          <router-link :to="localizedRoute(service)" class="t-w-full t-mb-2 lg:t-w-auto lg:t-mb-0 lg:t-mr-4 t-font-light t-text-normal">
            {{ $t('Are there any questions left?') }}
          </router-link>
          <button-component type="ghost" @click="$router.push(localizedRoute(`/my-account/order-review/${order.id}`))">
            {{ $t('Review order') }}
          </button-component>
        </div>
        <div class="t-w-1/2 lg:t-w-1/4 t-flex t-flex-wrap t-justify-between">
          <tracking-link :order-id="order.id" :status="order.status">
            <button-component type="second" icon="local_shipping" :icon-only="false">
              {{ $t('Shipment tracking') }}
            </button-component>
          </tracking-link>
        </div>
      </div>
    </div>
    <div class="t-p-4 t-bg-white t-mb-4">
      <div class="t-flex t-flex-wrap t--mx-2 t-text-sm t-text-base-tone">
        <div class="t-w-full sm:t-w-1/2 t-order-1 sm:t-order-0 t-px-2 t-mb-4">
          <div class="t-font-bold t-mb-1 t-text-base-lighter t-text-xxs t-uppercase">
            {{ $t('Billing address') }}
          </div>
          <p>{{ billingAddress.firstname }} {{ billingAddress.lastname }}</p>
          <p>{{ billingAddress.street[0] }} {{ billingAddress.street[1] }}</p>
          <p>{{ billingAddress.postcode }} {{ billingAddress.city }}</p>
          <p>{{ billingAddress.country }}</p>
        </div>
        <div class="t-w-full sm:t-w-1/2 t-order-3 sm:t-order-0 t-px-2 t-mb-4">
          <div class="t-font-bold t-mb-1 t-text-base-lighter t-text-xxs t-uppercase">
            {{ $t('Shipping address') }}
          </div>
          <p>{{ shippingAddress.firstname }} {{ shippingAddress.lastname }}</p>
          <p>{{ shippingAddress.street[0] }} {{ shippingAddress.street[1] }}</p>
          <p>{{ shippingAddress.postcode }} {{ shippingAddress.city }}</p>
          <p>{{ shippingAddress.country }}</p>
        </div>
        <div class="t-w-full sm:t-w-1/2 t-order-2 sm:t-order-0 t-px-2 t-mb-4 sm:t-mb-0">
          <div class="t-font-bold t-mb-1 t-text-base-lighter t-text-xxs t-uppercase">
            {{ $t('Payment method') }}
          </div>
          <p>{{ paymentMethod }}</p>
        </div>
        <div class="t-w-full sm:t-w-1/2 t-order-4 sm:t-order-0 t-px-2">
          <div class="t-font-bold t-mb-1 t-text-base-lighter t-text-xxs t-uppercase">
            {{ $t('Shipping method') }}
          </div>
          <p>{{ order.shipping_description }}</p>
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
        <button-component v-for="(option, key) in extractProductOptionValues(item.product_options)" :key="key" class="t-mr-2 t-mb-2" type="tag" size="sm" :cursor-pointer="false">
          {{ option }}
        </button-component>
        <div class="t-font-bold" :data-div="$t('Subtotal')">
          {{ item.row_total_incl_tax | price }}
        </div>
      </div>
    </div>

    <div class="t-p-4 t-bg-white t-mb-4">
      <div class="t-flex t-flex-wrap t--mx-2 t-text-sm t-text-base-tone">
        <div class="t-w-2/3 lg:t-w-3/4 t-px-2 t-text-right" v-text="$t('Subtotal')" />
        <div class="t-w-1/3 lg:t-w-1/4 t-px-2 t-text-right" v-text="price(order.subtotal)" />
        <div class="t-w-2/3 lg:t-w-3/4 t-px-2 t-text-right" v-text="$t('Shipping')" />
        <div class="t-w-1/3 lg:t-w-1/4 t-px-2 t-text-right" v-text="price(order.shipping_amount)" />
        <div class="t-w-2/3 lg:t-w-3/4 t-px-2 t-text-right" v-text="$t('Tax')" />
        <div class="t-w-1/3 lg:t-w-1/4 t-px-2 t-text-right" v-text="price((order.tax_amount + order.discount_tax_compensation_amount))" />
        <div class="t-w-2/3 lg:t-w-3/4 t-px-2 t-text-right" v-text="$t('Discount')" />
        <div class="t-w-1/3 lg:t-w-1/4 t-px-2 t-text-right" v-text="price(order.discount_amount)" />
        <div class="t-w-2/3 lg:t-w-3/4 t-px-2 t-text-right t-text-lg t-font-bold t-text-base-darkest t-mt-2" v-text="$t('Grand total')" />
        <div class="t-w-1/3 lg:t-w-1/4 t-px-2 t-text-right t-text-lg t-font-bold t-text-base-darkest t-mt-2" v-text="price(order.grand_total)" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import MyOrder from '@vue-storefront/core/compatibility/components/blocks/MyAccount/MyOrder'
import TrackingLink from 'icmaa-tracking/components/TrackingLink'
import ProductImage from 'theme/components/core/ProductImage'
import StatusIcon from 'theme/components/core/blocks/MyAccount/MyOrders/StatusIcon'
import ButtonComponent from 'theme/components/core/blocks/Button'
import { getThumbnailPath, productThumbnailPath } from '@vue-storefront/core/helpers'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import { price } from 'icmaa-config/helpers/price'

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
      return `${metaNavigation.route}`
    }
  },
  methods: {
    price,
    extractProductOptionValues (options) {
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
