<template>
  <div
    id="my_account"
    class="t-container t-px-4"
  >
    <div class="t--mx-2 t-flex t-py-4">
      <div
        v-if="!['xs','sm','md'].includes(viewport)"
        class="t-hidden t-w-1/4 t-px-2 xl:t-flex"
      >
        <Navigation />
      </div>
      <div class="t-w-full t-px-2 xl:t-w-3/4">
        <NoSsr>
          <component
            :is="$props.activeBlock"
            v-if="isLoggedIn"
          />
          <div slot="placeholder">
            <div class="t-bg-white t-p-4 t-text-base-light">
              {{ $t('Please wait') }} ...
            </div>
          </div>
        </NoSsr>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Logger } from '@vue-storefront/core/lib/logger'

import i18n from '@vue-storefront/i18n'
import NoSSR from 'vue-no-ssr'

const Navigation = () => import(/* webpackChunkName: "vsf-myaccount-navigation" */'theme/components/core/blocks/MyAccount/Navigation')
const MyProfile = () => import(/* webpackChunkName: "vsf-myaccount-myprofile" */'theme/components/core/blocks/MyAccount/MyProfile')
const MyAddresses = () => import(/* webpackChunkName: "vsf-myaccount-myaddresses" */'theme/components/core/blocks/MyAccount/MyAddresses')
const MyNewsletter = () => import(/* webpackChunkName: "vsf-myaccount-mynewsletter" */'theme/components/core/blocks/MyAccount/MyNewsletter')
const MyGiftcert = () => import(/* webpackChunkName: "vsf-myaccount-mygiftcert" */'theme/components/core/blocks/MyAccount/MyGiftcert')
const MyOrders = () => import(/* webpackChunkName: "vsf-myaccount-myorders" */'theme/components/core/blocks/MyAccount/MyOrders')
const MyOrder = () => import(/* webpackChunkName: "vsf-myaccount-myorder" */'theme/components/core/blocks/MyAccount/MyOrder')
const MyProductAlerts = () => import(/* webpackChunkName: "vsf-myaccount-myproductalerts" */'theme/components/core/blocks/MyAccount/MyProductAlerts')
const MyOrderReview = () => import(/* webpackChunkName: "vsf-myaccount-myorderreview" */'icmaa-review/components/MyAccount/MyOrderReview')

export default {
  name: 'MyAccount',
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
    NoSsr: NoSSR
  },
  props: {
    activeBlock: {
      type: String,
      default: 'MyProfile'
    }
  },
  async asyncData ({ context }) {
    if (context) {
      context.output.cacheTags
        .add(`my-account`)
    }
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport',
      isLoggedIn: 'user/isLoggedIn'
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
  beforeMount () {
    this.$bus.$on('myAccount-before-updateUser', this.onBeforeUpdateUser)
  },
  destroyed () {
    this.$bus.$off('myAccount-before-updateUser', this.onBeforeUpdateUser)
  },
  methods: {
    async onBeforeUpdateUser (updatedData, passwordData = false, message = false) {
      if (updatedData) {
        this.$store.dispatch('ui/loader', { message: i18n.t('Please wait') })

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
            this.$store.dispatch('ui/loader', false)
            return
          }
        }

        // Set defaults to fulfill JSON scheme of API
        const defaults = { dob: null, gender: '', cluster: null }
        const customer = Object.assign(defaults, updatedData)

        await this.$store.dispatch('user/update', { customer })
          .then(response => {
            if (response.resultCode === 200) {
              message = message || i18n.t('Account data has successfully been updated')
              this.showNotification(i18n.t(message), 'success')

              this.$store.dispatch('user/setSessionGenderByCustomerData')
            }
          })
          .catch(err => {
            this.showNotification(i18n.t('An error occured: ') + err.message, 'error')
          })

        this.$store.dispatch('ui/loader', false)
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
    const description = this.$route.meta.description
      ? [ { vmid: 'description', name: 'description', content: this.$route.meta.description } ] : []
    return {
      title: this.$route.meta.title || this.metaTitle,
      meta: [
        { vmid: 'robots', name: 'robots', content: 'noindex, nofollow' },
        ...description
      ]
    }
  }
}
</script>
