<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="local_mall">
      {{ $t('My orders') }}
    </headline>

    <!-- My orders body -->
    <div class="t-text-sm" v-show="!isHistoryEmpty">
      <template v-for="order in ordersHistory">
        <div :order="order" :key="order.entity_id" class="t-flex t-items-center t-justify-between t-cursor-pointer t-border-t t-mb-2 t-px-2 t-py-3" @click="redirect(order.entity_id)">
          <!-- order date -->
          <div class="t-flex t-flex-grow t-flex-wrap t-mr-8">
            <div class="t-w-full t-flex t-flex-wrap t-items-center">
              <div class="t-w-1/2 t-mb-4 t-mr-4">
                <div>{{ order.created_at | date }}</div>
              </div>
              <!-- total -->
              <div class="t-text-2xl t-mb-4">
                <div>{{ order.grand_total | price }}</div>
              </div>
            </div>

            <div class="t-w-full t-flex t-flex-wrap t-items-center">
              <div class="t-w-1/2 t-mb-4 t-mr-4">
                <div class="t-font-bold">
                  {{ $t('Order number') }}
                </div>
                <div>#{{ order.increment_id }}</div>
              </div>

              <div class="t-mb-4">
                <div class="t-font-bold">
                  Status
                </div>
                <div class="t-flex t-items-center">
                  <status-icon :status="order.status" /><span> {{ order.status | capitalize }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="">
            <material-icon icon="chevron_right" size="md" class="t-align-middle" />
          </div>
        </div>
      </template>
    </div>
    <div class="t-text-sm" v-show="isHistoryEmpty">
      <span class="t-py-2">{{ $t('No orders yet') }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import UserOrder from '@vue-storefront/core/modules/order/components/UserOrdersHistory'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import StatusIcon from 'theme/components/core/blocks/MyAccount/StatusIcon.vue'

export default {
  mixins: [UserOrder],
  components: {
    Headline,
    MaterialIcon,
    StatusIcon
  },
  methods: {
    redirect (orderId) {
      this.$router.push(this.localizedRoute(`/my-account/orders/${orderId}`))
    }
  }
}
</script>
