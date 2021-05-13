<template>
  <div class="empty-layout">
    <overlay v-if="overlayActive" />
    <loader />
    <div id="viewport" class="t-w-full">
      <slot />
      <sign-up />
      <cookie-notification />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Overlay from 'theme/components/core/Overlay'
import Loader from 'theme/components/core/Loader'
import SignUp from 'theme/components/core/blocks/Auth/SignUp'
import CookieNotification from 'theme/components/core/CookieNotification'

export default {
  components: {
    Overlay,
    Loader,
    SignUp,
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
