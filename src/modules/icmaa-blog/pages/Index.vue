<template>
  <div class="t-container t-my-8 t-px-4">
    <Article
      v-if="isArticle"
      :article="article"
    />
    <List
      v-else
      :articles="articles"
    >
      <h1 class="t-mb-8 t-flex t-flex-wrap t-items-baseline t-pr-2 t-text-2xl t-font-light t-text-base-dark">
        {{ isCategory ? category.name : identifier }}
        <template v-if="isCategory && category.children">
          <span class="t-my-1 t-ml-6 t-mr-3 t-hidden t-w-px t-self-stretch t-border-l t-border-base-dark md:t-block" />
          <div class="t-mt-2 t-flex t-w-full t-flex-wrap t-items-baseline t-border-l t-border-base-dark t-py-1 md:t-mt-0 md:t-w-auto md:t-border-none md:t-py-0">
            <router-link
              v-for="c in category.children"
              :key="c.url"
              :to="localizedRoute({ name: 'icmaa-blog-articles', params: { identifier: c.url } })"
              class="t-px-3 t-text-base"
            >
              {{ c.name }}
            </router-link>
          </div>
        </template>
      </h1>
    </List>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { BlogArticle, BlogCategory } from 'icmaa-blog/types/BlogState'
import cloneDeep from 'lodash-es/cloneDeep'

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
      const check = (c: BlogCategory) => {
        if (c.url === this.identifier) {
          return c
        } else if (c.children && c.children.length) {
          return c.children.find(check)
        }
      }

      return this.categories.find(check)
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
