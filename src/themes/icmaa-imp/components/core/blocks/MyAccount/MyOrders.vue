<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="local_mall">
      {{ $t('My orders') }}
    </headline>
    <!-- My orders body -->
    <div class="t-text-sm">
      <div class="" v-show="!isHistoryEmpty">
        <template v-for="order in ordersHistory">
          <div :order="order" :key="order.entity_id" class="t-flex t-flex-wrap t-items-center t-cursor-pointer t-rounded-sm t-bg-base-lightest t-mb-4 t-px-2 t-py-3" @click="redirect(order.entity_id)">
            <div class="t-flex t-flex-wrap t-w-2/5">
              <div v-show="viewport !== 'xs'" class="t-w-full sm:t-w-1/2 t-p-2">#{{ order.increment_id }}</div>
              <div class="t-w-full sm:t-w-1/2 t-p-2">
                {{ order.created_at | date }}
              </div>
            </div>
            <div class="t-flex t-flex-wrap t-w-2/5">
              <div class="t-w-full sm:t-w-1/2 t-p-2">
                {{ order.grand_total | price }}
              </div>

              <div class="t-w-full sm:t-w-1/2 t-p-2 t-flex t-items-center"><status-icon :status="order.status" /><span v-show="viewport !== 'xs'" class="status" />&nbsp;{{ order.status | capitalize }}</div>
            </div>
            <div class="t-w-1/5 t-flex t-justify-center">
              <material-icon icon="chevron_right" size="md" class="t-align-middle" />
            </div>
          </div>
        </template>
      </div>
      <div class="" v-show="isHistoryEmpty">
        <p>{{ $t('No orders yet') }}</p>
      </div>
      <!-- Custom design -->
      <div />
      <div />
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
  computed: {
    ...mapGetters({ viewport: 'ui/getViewport' })
  },
  methods: {
    redirect(orderId) {
      this.$router.push(this.localizedRoute(`/my-account/orders/${orderId}`))
    }
  }
}
</script>