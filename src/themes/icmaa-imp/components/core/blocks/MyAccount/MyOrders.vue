<template>
  <div class="t-p-4 t-bg-white">
    <headline icon="local_mall">
      {{ $t('My orders') }}
    </headline>
    <!-- My orders body -->
    <div class="t-text-sm">
      <div class="" v-show="!isHistoryEmpty">
        <table class="t-w-full t-table-auto t-text-left">
          <thead>
            <tr>
              <th v-show="viewport !== 'xs'" class="">
                {{ $t('Order ID') }}
              </th>
              <th class="">
                {{ $t('Date') }}
              </th>
              <th class="">
                {{ $t('Value') }}
              </th>
              <th class="">
                {{ $t('Status') }}
              </th>
              <th class="">
                &nbsp;
              </th>
            </tr>
          </thead class="">
          <tbody>
            <template v-for="order in ordersHistory">
              <tr :order="order" :key="order.entity_id" class="t-cursor-pointer t-border-t t-border-base-lightest t-px-2 t-py-3" @click="redirect(order.entity_id)">
                <td v-show="viewport !== 'xs'" class="t-py-2">
                  #{{ order.increment_id }}
                </td>
                <td class="t-py-2">
                  {{ order.created_at | date }}
                </td>
                <td class="t-py-2">
                  {{ order.grand_total | price }}
                </td>
                <td class="t-py-2 t-flex t-items-center">
                  <!-- {{ order.status | capitalize }}-->
                  <span class="status" />&nbsp;{{ order.status | capitalize }}
                </td>
                <td class="">
                  <material-icon icon="chevron_right" size="md" class="t-align-middle" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
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

export default {
  mixins: [UserOrder],
  components: {
    Headline,
    MaterialIcon
  },
  computed: {
    ...mapGetters({ viewport: 'ui/getViewport' })
  },
  methods: {
    redirect (orderId) {
      this.$router.push(this.localizedRoute(`/my-account/orders/${orderId}`))
    }
  }
}
</script>

<style lang="scss" scoped>
.status {
  height: 20px;
  width: 20px;
  background-color: greenyellow;
  border-radius: 50%;
  display: inline-block;
}
</style>
