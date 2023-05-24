<template>
  <div>
    <div class="t-mb-3 t-bg-white t-p-4">
      <headline>
        {{ $t('My orders') }}
      </headline>
      <p
        v-if="!isHistoryEmpty"
        class="t-text-sm"
      >
        {{ $t('These are your recent orders. Click for more details and options.') }}
      </p>
      <p
        v-else
        class="t-text-sm"
      >
        {{ $t('Sorry, but you don\'t have any orders yet.') }}
      </p>
    </div>
    <template v-if="!isHistoryEmpty">
      <router-link
        v-for="order in ordersHistory"
        :key="order.entity_id"
        tag="div"
        class="t-mt-1 t-flex t-cursor-pointer t-items-center t-bg-white t-p-4 t-text-sm t-text-base-tone"
        :to="localizedRoute(`/my-account/orders/${order.id}`)"
      >
        <div class="t-flex t-grow t-flex-wrap t-items-center t-justify-between">
          <div class="t-mb-2 t-w-1/2 lg:t-order-4 lg:t-mb-0 lg:t-w-1/4">
            <status-icon :status="order.status" />
          </div>
          <div class="t-mb-2 t-w-1/2 t-text-2xl t-text-base-darkest lg:t-order-3 lg:t-mb-0 lg:t-w-1/4">
            {{ order.grand_total | round | price }}
          </div>
          <div class="t-w-1/2 lg:t-order-1 lg:t-w-1/4">
            <div class="t-mb-1 t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
              {{ $t('Date') }}
            </div>
            {{ order.created_at | date }}
          </div>
          <div class="t-w-1/2 lg:t-order-2 lg:t-w-1/4">
            <div class="t-mb-1 t-text-xxs t-font-bold t-uppercase t-text-base-lighter">
              {{ $t('Order number') }}
            </div>
            #{{ order.increment_id }}
          </div>
        </div>
        <router-link
          :to="localizedRoute(`/my-account/orders/${order.id}`)"
          class="t-hidden t-flex-fix sm:t-block"
        >
          <material-icon
            icon="chevron_right"
            size="lg"
            class="t-align-middle"
          />
        </router-link>
      </router-link>
      <div
        v-if="loadMoreEnabled"
        class="t-mb-8 t-mt-4 t-flex t-items-center t-justify-center"
      >
        <button-component
          type="ghost"
          :disabled="loading"
          class="t-w-full md:t-w-2/3 lg:t-w-1/4"
          :class="{ 't-relative t-opacity-60': loading }"
          @click.native="loadMore"
        >
          {{ $t('Load more') }}
          <loader-background
            v-if="loading"
            bar="t-bg-base-darkest"
            class="t-bottom-0"
          />
        </button-component>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import StatusIcon from 'theme/components/core/blocks/MyAccount/MyOrders/StatusIcon'
import ButtonComponent from 'theme/components/core/blocks/Button'
import LoaderBackground from 'theme/components/core/LoaderBackground'

export default {
  name: 'MyOrders',
  components: {
    Headline,
    MaterialIcon,
    StatusIcon,
    ButtonComponent,
    LoaderBackground
  },
  data () {
    return {
      loadMoreEnabled: true,
      loading: false,
      page: 1
    }
  },
  computed: {
    ...mapGetters('user', ['getOrdersHistory']),
    ordersHistory () {
      return this.getOrdersHistory
    },
    isHistoryEmpty () {
      return this.getOrdersHistory.length < 1
    }
  },
  methods: {
    async loadMore () {
      this.loading = true
      this.page += 1

      await this.$store.dispatch('user/refreshOrdersHistory', { currentPage: this.page })
        .then(resp => {
          if (!resp || resp.code !== 200 || resp.result?.items?.length < 5) {
            this.loadMoreEnabled = false
          }
        })
        .catch(() => {
          this.page -= 1
          this.loadMoreEnabled = false
        })

      this.loading = false
    }
  }
}
</script>
