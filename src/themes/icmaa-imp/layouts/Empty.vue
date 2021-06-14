<template>
  <div class="empty-layout">
    <overlay v-if="overlayActive" />
    <loader />
    <div id="viewport" class="t-w-full">
      <slot />
      <auth-modal />
      <notifications />
      <cookie-notification />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Overlay from 'theme/components/core/Overlay'
import Loader from 'theme/components/core/Loader'
import Notifications from 'theme/components/core/blocks/Notification/Notifications'
import AuthModal from 'theme/components/core/blocks/Auth/Modal'
import CookieNotification from 'theme/components/core/CookieNotification'

export default {
  components: {
    Overlay,
    Loader,
    Notifications,
    AuthModal,
    CookieNotification
  },
  computed: {
    ...mapState({
      overlayActive: state => state.ui.overlay
    })
  },
  methods: {
    ...mapGetters({ getMetaData: 'icmaaMeta/getData' }),
    fetchMetaData () {
      return this.$store.dispatch('icmaaMeta/load')
    }
  },
  serverPrefetch () {
    return Promise.all([
      this.fetchMetaData()
    ])
  },
  metaInfo () {
    return this.getMetaData()
  }
}
</script>

<style lang="scss" src="theme/css/main.scss" />
