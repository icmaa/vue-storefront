<template>
  <div class="default-layout">
    <overlay v-if="overlayActive" />
    <loader />
    <div id="viewport" class="w-100 relative">
      <main-header />
      <no-ssr>
        <advice />
      </no-ssr>
      <async-sidebar
        :state-key="'searchpanel'"
        :async-component="SearchPanel"
        :wide="true"
      />
      <async-sidebar
        :state-key="'microcart'"
        :async-component="Microcart"
      />
      <async-sidebar
        :state-key="'sidebar'"
        :async-component="NavigationSidebar"
        direction="left"
      />
      <async-sidebar
        :state-key="'wishlist'"
        :async-component="Wishlist"
      />
      <main class="t-bg-base-lightest">
        <div class="t-clearfix" />
        <slot />
        <div class="t-clearfix" />
      </main>
      <main-footer />
      <notifications />
      <sign-up />
      <cookie-notification />
      <offline-badge />
      <order-confirmation :orders-data="ordersData" v-if="loadOrderConfirmation" />
    </div>
    <vue-progress-bar />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import AsyncSidebar from 'theme/components/core/blocks/AsyncSidebar/AsyncSidebar'
import MainHeader from 'theme/components/core/blocks/Header/Header'
import Advice from 'theme/components/core/blocks/Advice/Advice'
import MainFooter from 'theme/components/core/blocks/Footer/Footer'
import Overlay from 'theme/components/core/Overlay'
import Loader from 'theme/components/core/Loader'
import Notifications from 'theme/components/core/blocks/Notification/Notifications'
import SignUp from 'theme/components/core/blocks/Auth/SignUp'
import CookieNotification from 'theme/components/core/CookieNotification'
import OfflineBadge from 'theme/components/core/OfflineBadge'
import { isServer } from '@vue-storefront/core/helpers'
import viewportMixin from 'theme/mixins/viewportMixin.ts'
import NoSSR from 'vue-no-ssr'

const NavigationSidebar = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-sidebar-navigation" */ 'theme/components/core/blocks/Navigation/Sidebar')
const Microcart = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-microcart" */ 'theme/components/core/blocks/Microcart/Microcart')
const Wishlist = () => import(/* webpackPreload: true */ /* webpackChunkName: "vsf-wishlist" */ 'theme/components/core/blocks/Wishlist/Wishlist')
const SearchPanel = () => import(/* webpackChunkName: "vsf-search-panel" */ 'theme/components/core/blocks/SearchPanel/SearchPanel')
const OrderConfirmation = () => import(/* webpackChunkName: "vsf-order-confirmation" */ 'theme/components/core/blocks/Checkout/OrderConfirmation')

export default {
  data () {
    return {
      loadOrderConfirmation: false,
      ordersData: [],
      Microcart,
      Wishlist,
      SearchPanel,
      NavigationSidebar
    }
  },
  mixins: [viewportMixin],
  computed: {
    ...mapState({
      overlayActive: state => state.ui.overlay
    })
  },
  methods: {
    ...mapGetters({ getMetaData: 'icmaaMeta/getData' }),
    onOrderConfirmation (payload) {
      this.loadOrderConfirmation = true
      this.ordersData = payload
      this.$store.dispatch('ui/showModal', 'modal-order-confirmation')
    },
    fetchMetaData () {
      return this.$store.dispatch('icmaaMeta/load')
    },
    fetchCmsData () {
      const defaultBlocks = [ 'navigation-main', 'navigation-meta', 'footer', 'pdp-trust-signals' ]
      return this.$store.dispatch('icmaaCmsBlock/list', defaultBlocks.join(','))
    }
  },
  serverPrefetch () {
    return Promise.all([
      this.fetchMetaData()
    ])
  },
  beforeMount () {
    // Progress bar on top of the page
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start()
      this.$Progress.increase(40)
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
    this.$bus.$on('offline-order-confirmation', this.onOrderConfirmation)
  },
  mounted () {
    this.fetchCmsData()
  },
  beforeDestroy () {
    this.$bus.$off('offline-order-confirmation', this.onOrderConfirmation)
  },
  metaInfo () {
    let metaData = this.getMetaData()

    /**
     * #199586 We need to enable it for iOS devices to prevent from input zoom on focus
     * - The zoom will lead in errors reported by customers that "the site don't fit"
     * - iOS zooms all inputs which font-size is smaller than 16px – ours is by design
     * - We need to disable this meta-tag by default because Google-Lighthouse-Check needs
     *   this page to be accessible
     * - Since iOS11 you're still able to zoom the page but prevent the input zoom with this
     */
    if (!isServer && /iPhone|iPad/.test(navigator.userAgent)) {
      metaData.meta.push(
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' }
      )
    }

    return metaData
  },
  components: {
    MainHeader,
    Advice,
    MainFooter,
    NavigationSidebar, // eslint-disable-line vue/no-unused-components
    Overlay,
    Loader,
    Notifications,
    SignUp,
    CookieNotification,
    OfflineBadge,
    OrderConfirmation,
    AsyncSidebar,
    'no-ssr': NoSSR
  }
}
</script>

<style lang="scss" src="theme/css/main.scss"></style>
