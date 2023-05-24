<template>
  <div class="empty-layout">
    <Overlay v-if="overlayActive" />
    <Loader />
    <div
      id="viewport"
      class="t-w-full"
    >
      <slot />
      <AuthModal />
      <Notifications />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Overlay from 'theme/components/core/Overlay'
import Loader from 'theme/components/core/Loader'
import Notifications from 'theme/components/core/blocks/Notification/Notifications'
import AuthModal from 'theme/components/core/blocks/Auth/Modal'
import viewportMixin from 'theme/mixins/viewportMixin.ts'

export default {
  components: {
    Overlay,
    Loader,
    Notifications,
    AuthModal
  },
  mixins: [ viewportMixin ],
  computed: {
    ...mapState({
      overlayActive: state => state.ui.overlay
    })
  },
  mounted () {
    this.$store.dispatch('ui/initModalDelay')
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
