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

export default {
  name: 'BlogHome',
  components: {
    List
  },
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
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: this.$t('Impericon Mag – your magazine with the latest news, albums & videos from metalcore, hardcore, deathcore, rock, metal & pop punk.')
        }
      ]
    }
  }
}
</script>
