<template>
  <div class="t-container t-my-8 t-px-4">
    <template v-for="category in categories">
      <!--Teaser
        v-if="i === 1"
        :key="'teaser-' + i"
        tags="325"
        :show-split="false"
        class="t-mb-8 sm:t--mx-4"
      /-->
      <List
        :key="category.url"
        :query="{ categories: category.url }"
      />
    </template>
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
