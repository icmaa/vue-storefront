<template>
  <div class="minimal-layout">
    <Loader />
    <div
      id="viewport"
      class="t-w-full"
    >
      <MinimalHeader />
      <slot />
      <MinimalFooter />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MinimalHeader from 'theme/components/core/blocks/Header/MinimalHeader.vue'
import MinimalFooter from 'theme/components/core/blocks/Footer/MinimalFooter.vue'
import Loader from 'theme/components/core/Loader'

export default {
  components: {
    MinimalHeader,
    MinimalFooter,
    Loader
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
