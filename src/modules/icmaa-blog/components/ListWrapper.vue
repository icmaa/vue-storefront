<template>
  <List
    v-if="articles.length > 0"
    :articles="articles"
    :category="category"
    :headline="headline"
  />
</template>

<script lang="ts">
import i18n from '@vue-storefront/i18n'
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
    },
    headlineLevel: {
      type: Number,
      default: 2
    }
  },
  computed: {
    ...mapGetters({
      getCategories: 'icmaaBlog/getCategories',
      getCategoryBy: 'icmaaBlog/getCategoryBy',
      getArticlesByQuery: 'icmaaBlog/getArticlesByQuery'
    }),
    isRoot (): boolean {
      return Object.keys(this.query).length === 0
    },
    isCategory (): boolean {
      return (this.query?.categories || this.isRoot) && !!this.category
    },
    category (): BlogCategory {
      if (this.isRoot) {
        return {
          name: i18n.t('Blog') as string,
          url: 'root',
          children: this.getCategories
        }
      }

      return this.getCategoryBy(this.query?.categories)
    },
    articles (): any {
      return this.getArticlesByQuery(this.query)
    }
  },
  async mounted () {
    return this.fetchData()
  },
  async serverPrefetch () {
    return (this as any).fetchData()
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
