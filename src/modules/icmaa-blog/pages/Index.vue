<template>
  <div class="t-container t-my-8 t-p-4">
    <Navigation :items="categories || []" />
    <Article
      v-if="isArticle"
      :article="article"
    />
    <List
      v-else
      :articles="articles"
      :headline="isCategory ? category.name : identifier"
    />
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { BlogArticle, BlogCategory } from 'icmaa-blog/types/BlogState'
import cloneDeep from 'lodash-es/cloneDeep'

import Article from 'icmaa-blog/components/Article.vue'
import List from 'icmaa-blog/components/List.vue'
import Navigation from 'icmaa-blog/components/Navigation.vue'

export default {
  name: 'BlogPage',
  components: {
    Article,
    List,
    Navigation
  },
  async serverPrefetch () {
    return (this as any).fetchData()
  },
  computed: {
    ...mapGetters({
      getArticle: 'icmaaBlog/getArticleBy',
      getResolvedUrlIds: 'icmaaBlog/getResolvedUrlIds',
      categories: 'icmaaBlog/getCategories'
    }),
    identifier (): string {
      const { params } = this.$route
      return params.identifier
    },
    article (): BlogArticle {
      return this.getArticle(this.identifier)
    },
    isArticle (): boolean {
      return !!this.article
    },
    articles (): BlogArticle[] {
      return this.getResolvedUrlIds(this.identifier)
        .map(id => this.getArticle(id, 'id'))
    },
    flattenCategories (): BlogCategory[] {
      return this.flatten(this.categories || [])
    },
    isCategory (): boolean {
      return this.flattenCategories
        .map(c => c.url)
        .includes(this.identifier)
    },
    category (): BlogCategory {
      return this.flattenCategories.find(c => c.url === this.identifier)
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
      ]).then(() => {
        if (!this.isArticle && !this.isCategory) {
          console.error('No article or category found for this route!')
        }
      })
    },
    flatten (items: BlogCategory[]) {
      let children = [];
      const flattenMembers = cloneDeep(items).map(m => {
        if (m.children && m.children.length) {
          children = [...children, ...m.children]
          delete m.children
        }
        return m
      });

      return flattenMembers.concat(
        children.length
          ? this.flatten(children) : children
      )
    }
  }
}
</script>
