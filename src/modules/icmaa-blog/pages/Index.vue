<template>
  <div class="t-container t-my-4 t-px-4 md:t-my-8">
    <Article
      v-if="isArticle"
      :article="article"
    />
    <List
      v-else
      :articles="articles"
      :category="category"
    />
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { BlogArticle, BlogCategory } from 'icmaa-blog/types/BlogState'

import Article from 'icmaa-blog/components/Article.vue'
import List from 'icmaa-blog/components/List.vue'

export default {
  name: 'BlogPage',
  components: {
    Article,
    List
  },
  async serverPrefetch () {
    return (this as any).fetchData()
  },
  computed: {
    ...mapGetters({
      getArticle: 'icmaaBlog/getArticleByQuery',
      getArticles: 'icmaaBlog/getArticleByQuery',
      getResolvedUrlIds: 'icmaaBlog/getResolvedUrlIds',
      getCategoryBy: 'icmaaBlog/getCategoryBy'
    }),
    identifier (): string {
      const { params } = this.$route
      return params.identifier
    },
    article (): BlogArticle | null {
      return this.getArticle({ identifier: this.identifier })
    },
    isArticle (): boolean {
      return !!this.article
    },
    articles (): BlogArticle[] {
      return this.getResolvedUrlIds(this.identifier)
        .map(id => this.getArticles({ id }))
    },
    isCategory (): boolean {
      return !!this.category
    },
    category (): BlogCategory {
      return this.getCategoryBy(this.identifier)
    }
  },
  watch: {
    identifier () {
      return this.fetchData()
    }
  },
  async mounted () {
    return this.fetchData()
  },
  methods: {
    fetchData () {
      return Promise.all([
        this.$store.dispatch('icmaaBlog/fetchCategories'),
        this.$store.dispatch('icmaaBlog/resolveUrl', { route: this.$route })
      ])
    }
  }
}
</script>
