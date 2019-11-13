<template>
  <div id="my_account" class="t-container">
    <div class="t-flex t-flex-wrap t-items-start t-px-4 t--mx-2 t-py-4">
      <navigation class="customer-account t-flex t-px-2 t-mb-4 lg:t-mb-0 lg:t-w-1/4" />
      <div class="t-w-full lg:t-w-3/4 t-px-2">
        <no-ssr>
          <component :is="this.$props.activeBlock" />
        </no-ssr>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import Composite from '@vue-storefront/core/mixins/composite'
import { currentStoreView, localizedRoute } from '@vue-storefront/core/lib/multistore'
import { Logger } from '@vue-storefront/core/lib/logger'

import Navigation from 'theme/components/core/blocks/MyAccount/Navigation'
import MyProfile from '../components/core/blocks/MyAccount/MyProfile'
import MyAddresses from '../components/core/blocks/MyAccount/MyAddresses'
import MyNewsletter from '../components/core/blocks/MyAccount/MyNewsletter'
import MyOrders from '../components/core/blocks/MyAccount/MyOrders'
import MyOrder from '../components/core/blocks/MyAccount/MyOrder'
import MyRecentlyViewed from '../components/core/blocks/MyAccount/MyRecentlyViewed'
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
  data () {
    return {
      navigation: []
    }
  },
  components: {
    MyProfile,
    MyAddresses,
    MyNewsletter,
    MyOrders,
    MyOrder,
    MyRecentlyViewed,
    Navigation,
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
  methods: {
    async onBeforeUpdateUser (updatedData, passwordData = false) {
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
              this.showNotification(i18n.t('Account data has successfully been updated'), 'success')
            }
          })
          .catch(err => {
            this.showNotification(i18n.t('An error occured: ') + err.message, 'error')
          })

        this.$bus.$emit('notification-progress-stop', {})
      }
    },
    showNotification (message, type) {
      this.$store.dispatch('notification/spawnNotification', {
        type, message, action1: { label: i18n.t('OK') }
      })
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || i18n.t('My Account'),
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
