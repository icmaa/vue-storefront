<template>
  <List
    v-if="articles.length > 0"
    :articles="articles"
    :category="category"
    :headline="headline"
  />
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { BlogCategory } from 'icmaa-blog/types/BlogState'

import List from 'icmaa-blog/components/List.vue'

export default {
  name: 'BlogListWrapper',
  components: {
    List
  },
  props: {
    query: {
      type: Object,
      required: true
    },
    size: {
      type: Number,
      default: 3
    },
    headline: {
      type: [String, null],
      default: null
    }
  },
  computed: {
    ...mapGetters({
      getCategoryBy: 'icmaaBlog/getCategoryBy',
      getArticlesByQuery: 'icmaaBlog/getArticlesByQuery'
    }),
    isCategory (): boolean {
      return this.query?.categories && !!this.category
    },
    category (): BlogCategory {
      return this.getCategoryBy(this.query?.categories)
    },
    articles (): any {
      return this.getArticlesByQuery(this.query)
    }
  },
  async mounted () {
    return this.fetchData()
  },
  methods: {
    fetchData () {
      return Promise.all([
        this.$store.dispatch('icmaaBlog/fetchCategories'),
        this.$store.dispatch('icmaaBlog/list', { queryOptions: this.query, size: this.size })
      ])
    }
  }
}
</script>
