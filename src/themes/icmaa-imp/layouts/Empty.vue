<template>
  <div class="empty-layout">
    <div id="viewport" class="t-w-full">
      <slot />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
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
