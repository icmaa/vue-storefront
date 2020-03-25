<template>
  <div id="my_account" class="t-container t-px-4">
    <div class="t-flex t--mx-2 t-py-4">
      <div class="t-hidden lg:t-flex t-w-1/4 t-px-2" v-if="viewport && !['xs','sm','md'].includes(viewport)">
        <navigation />
      </div>
      <no-ssr>
        <div class="t-w-full lg:t-w-3/4 t-px-2">
          <component :is="this.$props.activeBlock" />
        </div>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import Composite from '@vue-storefront/core/mixins/composite'
import { currentStoreView, localizedRoute } from '@vue-storefront/core/lib/multistore'
import { Logger } from '@vue-storefront/core/lib/logger'

import Navigation from '../components/core/blocks/MyAccount/Navigation'
import MyProfile from '../components/core/blocks/MyAccount/MyProfile'
import MyAddresses from '../components/core/blocks/MyAccount/MyAddresses'
import MyNewsletter from '../components/core/blocks/MyAccount/MyNewsletter'
import MyGiftcert from '../components/core/blocks/MyAccount/MyGiftcert'
import MyOrders from '../components/core/blocks/MyAccount/MyOrders'
import MyOrder from '../components/core/blocks/MyAccount/MyOrder'
import MyProductAlerts from '../components/core/blocks/MyAccount/MyProductAlerts'
import MyOrderReview from 'icmaa-review/components/MyAccount/MyOrderReview'
import NoSSR from 'vue-no-ssr'

export default {
  name: 'MyAccount',
  mixins: [Composite],
  props: {
    activeBlock: {
      type: String,
      default: 'MyProfile'
    }
  },
  components: {
    Navigation,
    MyProfile,
    MyAddresses,
    MyNewsletter,
    MyGiftcert,
    MyOrders,
    MyOrder,
    MyProductAlerts,
    MyOrderReview,
    'no-ssr': NoSSR
  },
  beforeMount () {
    this.$bus.$on('myAccount-before-updateUser', this.onBeforeUpdateUser)
  },
  async mounted () {
    await this.$store.dispatch('user/startSession')
    if (!this.$store.getters['user/isLoggedIn']) {
      localStorage.setItem('redirect', this.$route.path)
      this.$router.push(localizedRoute('/', currentStoreView().storeCode))
    }
  },
  destroyed () {
    this.$bus.$off('myAccount-before-updateUser', this.onBeforeUpdateUser)
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport'
    }),
    metaTitle () {
      const titleMap = {
        'MyAccount': 'My profile',
        'MyOrder': 'My order',
        'MyOrders': 'My orders',
        'MyAddresses': 'My addresses',
        'MyNewsletter': 'My newsletter',
        'MyGiftcert': 'My coupons',
        'MyProductAlerts': 'My product-alerts',
        'MyOrderReview': 'Order-Review'
      }

      return i18n.t(titleMap[this.activeBlock] || 'My Account')
    }
  },
  methods: {
    async onBeforeUpdateUser (updatedData, passwordData = false, message = false) {
      if (updatedData) {
        this.$bus.$emit('notification-progress-start', i18n.t('Please wait'))

        if (passwordData) {
          passwordData = await this.$store.dispatch('user/changePassword', passwordData)
            .then(response => {
              if (response.resultCode === 200) {
                return true
              }
            })
            .catch(err => {
              this.showNotification(i18n.t('An error occured:') + err.message, 'error')
              Logger.error('Error while saving password: ', 'MyAccount', err)()
            })

          if (!passwordData) {
            this.$bus.$emit('notification-progress-stop', {})
            return
          }
        }

        await this.$store.dispatch('user/update', { customer: updatedData })
          .then(response => {
            if (response.resultCode === 200) {
              if (!message) {
                message = i18n.t('Account data has successfully been updated')
              }
              this.showNotification(i18n.t(message), 'success')
            }
          })
          .catch(err => {
            this.showNotification(i18n.t('An error occured: ') + err.message, 'error')
          })

        this.$bus.$emit('notification-progress-stop', {})
      }
    },
    async showNotification (message, type) {
      await this.$store.dispatch('notification/spawnNotification', {
        type, message, action1: { label: i18n.t('OK') }
      })

      this.$bus.$emit('myAccount-after-updateUser-' + type)
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || this.metaTitle,
      meta: this.$route.meta.description ? [{ vmid: 'description', name: 'description', content: this.$route.meta.description }] : []
    }
  },
  asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data
    return new Promise((resolve, reject) => {
      if (context) context.output.cacheTags.add(`my-account`)
      resolve()
    })
  }
}
</script>