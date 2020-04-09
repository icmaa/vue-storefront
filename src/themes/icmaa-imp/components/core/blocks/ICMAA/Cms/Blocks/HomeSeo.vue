<template>
  <div class="t-my-8 t-container t-px-4" v-html="cmsData.content" />
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'
import { isServer } from '@vue-storefront/core/helpers'

export default {
  name: 'HomeSeo',
  methods: {
    async fetchCmsData () {
      await this.$store.dispatch('icmaaCmsBlock/list', 'home-seo')
    }
  },
  async serverPrefetch () {
    await this.fetchCmsData()
  },
  async created () {
    if (isServer) {
      return
    }

    await this.fetchCmsData()
  },
  mounted () {
    this.fetchCmsData()
  },
  computed: {
    ...mapGetters('icmaaCmsBlock', ['getBlockByIdentifier']),
    cmsData () {
      return this.getBlockByIdentifier('home-seo')
    }
  }
}
</script>
