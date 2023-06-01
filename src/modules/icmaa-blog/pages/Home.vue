<template>
  <div class="t-container t-my-8 t-px-4">
    <h1 class="t-mb-4 t-pr-2 t-text-2xl t-font-light t-text-base-dark">
      {{ $t('Magazine') }}
    </h1>
    <List
      :query="{}"
      :headline="$t('Latest articles')"
      :size="9"
    />
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

import List from 'icmaa-blog/components/ListWrapper.vue'
import BlogMetaMixin from 'icmaa-blog/mixins/meta'

export default {
  name: 'BlogHome',
  components: {
    List
  },
  mixins: [ BlogMetaMixin ],
  async asyncData (c) {
    c.context?.output.cacheTags
      .add('blog')
  },
  async serverPrefetch () {
    return (this as any).fetchData()
  },
  computed: {
    ...mapGetters({
      categories: 'icmaaBlog/getCategories'
    })
  },
  async mounted () {
    return this.fetchData()
  },
  methods: {
    fetchData () {
      return Promise.all([
        this.$store.dispatch('icmaaBlog/fetchCategories')
      ])
    }
  },
  metaInfo () {
    return {
      title: this.$t('Magazine'),
      ...this.metaInfo()
    }
  }
}
</script>
