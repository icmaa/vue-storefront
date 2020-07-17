<template>
  <modal v-if="loadCookieNotificationModal" :visible="loadCookieNotificationModal" @close="close" />
</template>

<script>

import { mapGetters } from 'vuex'

const CookieNotificationModal = () => import(/* webpackChunkName: "vsf-cookie-modification-modal" */ 'theme/components/core/CookieNotificationModal.vue')

export default {
  name: 'CookieNotification',
  components: {
    modal: CookieNotificationModal
  },
  data () {
    return {
      loadCookieNotificationModal: false
    }
  },
  computed: {
    ...mapGetters({
      isModalVisible: 'ui/isModalVisible'
    })
  },
  methods: {
    loadModal (urlPath) {
      const pageAllowList = [
        'service-imprint',
        'service-privacy'
      ]

      if (!urlPath) {
        urlPath = this.$route.params.identifier
      }

      this.$store.dispatch('claims/check', { claimCode: 'cookiesAccepted' })
        .then(cookie => {
          this.loadCookieNotificationModal = (cookie === null && !pageAllowList.includes(urlPath))
          if (!this.loadCookieNotificationModal && this.isModalVisible('modal-cookie-notification')) {
            this.$store.dispatch('ui/hideModal', 'modal-cookie-notification')
          }
        })
    },
    close () {
      this.loadCookieNotificationModal = false
    }
  },
  async created () {
    this.$store.dispatch(
      'ui/setModalPriority',
      { name: 'modal-cookie-notification', priority: 100 }
    )

    this.loadModal()
  },
  watch: {
    async $route (to, from) {
      this.loadModal(to.params.identifier)
    }
  }
}
</script>
