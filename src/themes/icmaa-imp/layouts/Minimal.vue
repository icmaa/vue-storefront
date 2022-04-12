<template>
  <div class="minimal-layout">
    <loader />
    <div id="viewport" class="t-w-full">
      <minimal-header />
      <slot />
      <minimal-footer />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MinimalHeader from 'theme/components/core/blocks/Header/MinimalHeader.vue'
import MinimalFooter from 'theme/components/core/blocks/Footer/MinimalFooter.vue'
import Loader from 'theme/components/core/Loader'

export default {
  methods: {
    ...mapGetters({ getMetaData: 'icmaaMeta/getData' }),
    fetchMetaData () {
      return this.$store.dispatch('icmaaMeta/load')
    }
  },
  mounted () {
    this.$store.dispatch('ui/initModalDelay')
  },
  serverPrefetch () {
    return Promise.all([
      this.fetchMetaData()
    ])
  },
  metaInfo () {
    return this.getMetaData()
  },
  components: {
    MinimalHeader,
    MinimalFooter,
    Loader
  }
}
</script>

<style lang="scss" src="theme/css/main.scss" />
