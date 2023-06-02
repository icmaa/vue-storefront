<template>
  <List
    v-if="articles.length > 0"
    :articles="articles"
    :category="category"
    :headline="headline"
    :headline-level="headlineLevel"
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
    isRoot: {
      type: Boolean,
      default: false
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
  data () {
    return {
      articles: []
    }
  },
  computed: {
    ...mapGetters({
      getCategories: 'icmaaBlog/getCategories',
      getCategoryBy: 'icmaaBlog/getCategoryBy'
    }),
    isCategory (): boolean {
      return (this.query?.categories || this.isRoot) && !!this.category
    },
    category (): BlogCategory {
      if (this.isRoot) {
        return {
          name: this.headline || i18n.t('Magazine') as string,
          url: 'root',
          children: this.getCategories
        }
      }

      return this.getCategoryBy(this.query?.categories)
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
      const articlePromise = this.$store.dispatch(
        'icmaaBlog/list',
        { queryOptions: this.query, size: this.size }
      ).then(r => {
        this.articles = r.items
      })

      return Promise.all([
        this.$store.dispatch('icmaaBlog/fetchCategories'),
        articlePromise
      ])
    }
  }
}
</script>
