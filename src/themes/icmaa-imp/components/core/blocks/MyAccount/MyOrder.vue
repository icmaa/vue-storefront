<template>
  <div>
    <div
      v-if="order && (typeof order !== 'undefined')"
      class="t-mb-4 t-bg-white t-p-4"
    >
      <Headline>
        {{ $t('Order') }}
        <span
          v-if="order"
          class="t-ml-4 t-grow t-text-sm t-text-base-light lg:t-flex-fix"
        ># {{ order.increment_id }}</span>
      </Headline>
      <div class="t-flex t-flex-wrap t-justify-between t-text-sm t-text-base-tone">
        <div class="t-mb-4 t-w-1/2 lg:t-mb-0 lg:t-w-1/4">
          <div class="t-mb-1 t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
            {{ $t('Date') }}
          </div>
          {{ order.created_at | date }}
        </div>
        <div class="t-mb-4 t-w-1/2 lg:t-mb-0 lg:t-w-1/4">
          <div class="t-mb-1 t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
            {{ $t('Status') }}
          </div>
          <StatusIcon :status="order.status" />
        </div>
        <div class="t-flex t-w-full t-flex-wrap t-items-center t-justify-between lg:t-w-2/4 lg:t-justify-end">
          <router-link
            :to="localizedRoute('/service')"
            class="t-text-normal t-mb-2 t-w-full t-font-light lg:t-mb-0 lg:t-mr-4 lg:t-w-auto"
          >
            {{ $t('Are there any questions left?') }}
          </router-link>
          <ButtonComponent
            type="ghost"
            @click="goToReview"
          >
            {{ $t('Review order') }}
          </ButtonComponent>
        </div>
      </div>
    </div>
    <div class="t-mb-4 t-bg-white t-p-4">
      <div class="t--mx-2 t-flex t-flex-wrap t-text-sm t-text-base-tone">
        <div class="t-order-1 t-mb-4 t-w-full t-px-2 sm:t-order-none sm:t-w-1/2">
          <div class="t-mb-1 t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
            {{ $t('Billing address') }}
          </div>
          <p>{{ billingAddress.firstname }} {{ billingAddress.lastname }}</p>
          <p>{{ billingAddress.street[0] }} {{ billingAddress.street[1] }}</p>
          <p>{{ billingAddress.postcode }} {{ billingAddress.city }}</p>
          <p>{{ billingAddress.country }}</p>
        </div>
        <div class="t-order-3 t-mb-4 t-w-full t-px-2 sm:t-order-none sm:t-w-1/2">
          <div class="t-mb-1 t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
            {{ $t('Shipping address') }}
          </div>
          <p>{{ shippingAddress.firstname }} {{ shippingAddress.lastname }}</p>
          <p>{{ shippingAddress.street[0] }} {{ shippingAddress.street[1] }}</p>
          <p>{{ shippingAddress.postcode }} {{ shippingAddress.city }}</p>
          <p>{{ shippingAddress.country }}</p>
        </div>
        <div class="t-order-2 t-mb-4 t-w-full t-px-2 sm:t-order-none sm:t-mb-0 sm:t-w-1/2">
          <div class="t-mb-1 t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
            {{ $t('Payment method') }}
          </div>
          <p v-if="paymentMethod">
            {{ $t(paymentMethod) }}
          </p>
          <p v-else>
            {{ $t('No informations') }}
          </p>
        </div>
        <div class="t-order-4 t-w-full t-px-2 sm:t-order-none sm:t-w-1/2">
          <div class="t-mb-1 t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
            {{ $t('Shipping method') }}
          </div>
          <p v-text="order.shipping_description || $t('No informations')" />
          <p
            v-if="hasPriorityHandling"
            v-text="order.priority_handling_fee_description || $t('Priority Service')"
          />
          <p
            v-if="hasDhlGoGreen"
            v-text="order.dhl_go_green_fee_description || $t('DHL GoGreen')"
          />
          <TrackingLink
            :order-id="order.id"
            class="t-mt-2"
          >
            <ButtonComponent
              type="ghost"
              icon="local_shipping"
            >
              {{ $t('Shipment tracking') }}
            </ButtonComponent>
          </TrackingLink>
        </div>
      </div>
    </div>

    <div>
      <div class="t-mb-4 t-pl-4 t-text-xl t-font-extralight t-text-base-tone">
        {{ $t('Items ordered') }}
      </div>
      <div class="t-hidden t-items-center t-bg-white t-p-4 t-pb-0 md:t-flex">
        <div class="t-w-8/12 t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
          {{ $t('Product name') }}
        </div>
        <div class="t-w-2/12 t-text-right t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
          {{ $t('Qty') }}
        </div>
        <div class="t-w-2/12 t-text-right t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
          {{ $t('Subtotal') }}
        </div>
      </div>
      <div
        v-for="item in singleOrderItemsWithOptions"
        :key="item.item_id"
        class="t-mb-1 t-bg-white t-p-4 t-text-sm t-text-base-tone"
      >
        <div class="t-flex t-flex-wrap t-items-end">
          <div
            class="t-mb-2 t-w-full t-text-sm md:t-mb-0 md:t-w-8/12"
            :data-div="$t('Product Name')"
          >
            <router-link
              :to="item.product_link"
              class="t-text-primary"
            >
              {{ item.name }}
            </router-link>
            <div
              v-for="(option, i) in item.options"
              :key="i"
            >
              {{ option.label }}: {{ option.value }}
            </div>
          </div>
          <div class="t-w-2/3 t-text-right md:t-w-2/12">
            {{ item.qty_ordered | round(0) }}
            <span
              class="t-text-xxs t-uppercase md:t-hidden"
              v-text="$t('Pcs.')"
            />
          </div>
          <div
            class="t-w-1/3 t-text-right md:t-w-2/12"
            :data-div="$t('Subtotal')"
          >
            {{ item.row_total_incl_tax | round | price }}
          </div>
        </div>
      </div>
    </div>

    <div class="t-mb-4 t-bg-white t-p-4">
      <div class="t--mx-2 t-flex t-flex-wrap t-text-sm t-text-base-tone">
        <div
          class="t-w-2/3 t-px-2 t-text-right lg:t-w-3/4"
          v-text="$t('Subtotal')"
        />
        <div class="t-w-1/3 t-px-2 t-text-right lg:t-w-1/4">
          {{ order.subtotal_incl_tax | round | price }}
        </div>
        <div
          class="t-w-2/3 t-px-2 t-text-right lg:t-w-3/4"
          v-text="$t('Shipping')"
        />
        <div class="t-w-1/3 t-px-2 t-text-right lg:t-w-1/4">
          {{ order.shipping_incl_tax | round | price }}
        </div>
        <template v-if="order.payment.method === 'cashondelivery'">
          <div
            class="t-w-2/3 t-px-2 t-text-right lg:t-w-3/4"
            v-text="$t('Cash on delivery')"
          />
          <div class="t-w-1/3 t-px-2 t-text-right lg:t-w-1/4">
            {{ parseFloat(order.base_cod_fee) + parseFloat(order.base_cod_tax_amount) | round | price }}
          </div>
        </template>
        <template v-if="hasPriorityHandling">
          <div
            class="t-w-2/3 t-px-2 t-text-right lg:t-w-3/4"
            v-text="order.priority_handling_fee_description || $t('Priority Service')"
          />
          <div class="t-w-1/3 t-px-2 t-text-right lg:t-w-1/4">
            {{ order.priority_handling_fee | round | price }}
          </div>
        </template>
        <template v-if="hasDhlGoGreen">
          <div
            class="t-w-2/3 t-px-2 t-text-right lg:t-w-3/4"
            v-text="order.dhl_go_green_fee_description || $t('DHL GoGreen')"
          />
          <div class="t-w-1/3 t-px-2 t-text-right lg:t-w-1/4">
            {{ order.dhl_go_green_fee | round | price }}
          </div>
        </template>
        <template v-if="order.discount_amount < 0">
          <div
            class="t-w-2/3 t-px-2 t-text-right lg:t-w-3/4"
            v-text="$t('Discount')"
          />
          <div class="t-w-1/3 t-px-2 t-text-right lg:t-w-1/4">
            {{ order.discount_amount | round | price }}
          </div>
        </template>
        <div
          class="t-mt-2 t-w-2/3 t-px-2 t-text-right t-text-lg t-font-bold t-text-base-darkest lg:t-w-3/4"
          v-text="$t('Grand total')"
        />
        <div class="t-mt-2 t-w-1/3 t-px-2 t-text-right t-text-lg t-font-bold t-text-base-darkest lg:t-w-1/4">
          {{ order.grand_total | round | price }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from 'icmaa-url/helpers'
import i18n from '@vue-storefront/i18n'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import { UserSingleOrder } from '@vue-storefront/core/modules/order/components/UserSingleOrder'
import StatusIcon from 'theme/components/core/blocks/MyAccount/MyOrders/StatusIcon'
import TrackingLink from 'theme/components/core/blocks/MyAccount/MyOrders/TrackingLink'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'MyOrder',
  components: {
    Headline,
    StatusIcon,
    TrackingLink,
    ButtonComponent
  },
  mixins: [ UserSingleOrder ],
  computed: {
    ...mapGetters({
      getOptionLabel: 'attribute/getOptionLabel'
    }),
    singleOrderItemsWithOptions () {
      return this.singleOrderItems.map(item => {
        const product = this.getProduct(item)
        item.product_link = product ? formatProductLink(product, currentStoreView().storeCode) : ''
        item.options = this.getProductOptions(item)
        return item
      })
    },
    attributeCodes () {
      let attributeCodes = []
      if (!this.order.products) {
        return attributeCodes
      }

      this.order.products
        .filter(p => p.configurable_options)
        .forEach(p => {
          p.configurable_options.forEach(ch => {
            if (!attributeCodes.includes(ch.attribute_code)) {
              attributeCodes.push(ch.attribute_code)
            }
          })
        })

      return attributeCodes
    },
    hasPriorityHandling () {
      return this.order?.priority_handling_fee && this.order?.priority_handling_fee > 0
    },
    hasDhlGoGreen () {
      return this.order?.dhl_go_green_fee && this.order.dhl_go_green_fee > 0
    }
  },
  async mounted () {
    if (!this.order.products) {
      await this.$store.dispatch('user/loadProductsForOrders', [ this.order ])
    }

    this.$store.dispatch('attribute/list', { filterValues: this.attributeCodes })
  },
  methods: {
    getProduct (orderItem) {
      if (!this.order || !this.order.products) {
        return false
      }

      return this.order.products.find(p => {
        const idKey = p.type_id === 'simple' ? 'id' : 'parentId'
        return p[idKey].toString() === orderItem.product_id.toString()
      }) || false
    },
    getProductOptions (orderItem) {
      if (!this.order || !this.order.products) {
        return []
      }

      const product = this.getProduct(orderItem)
      if (!product || !product.configurable_options) {
        return []
      }

      const options = []
      product.configurable_options.forEach(o => {
        const attributeKey = o.attribute_code
        const label = /size/.test(attributeKey) ? i18n.t('Size') : o.label
        const childProduct = product.configurable_children.find(c => c.sku === orderItem.sku)
        const optionId = childProduct[o.attribute_code]
        const value = this.getOptionLabel({ attributeKey, optionId })
        options.push({ label, value })
      })

      return options
    },
    goToReview () {
      this.$router.push(
        this.localizedRoute(`/my-account/order-review/${this.order.id}`)
      )
    }
  }
}
</script>
