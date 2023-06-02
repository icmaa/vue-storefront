<template>
  <div class="t-container t-mt-4 t-px-4 md:t-mt-8">
    <ArticleComponent
      v-if="isArticle"
      :article="article"
      class="t-mb-4"
    />
    <List
      v-else-if="isTag"
      :articles="articles"
      :headline="$t('Blog #{tag}', { tag })"
      :pagination="pagination"
      @load-prev="loadPrev"
    />
    <template v-else>
      <h1
        class="t-mb-4 t-pr-2 t-text-2xl t-font-light t-text-base-dark"
      >
        <router-link
          :to="localizedRoute({ name: 'icmaa-blog-home' })"
          class="hover:t-underline"
        >
          {{ $t('Magazine') }}
        </router-link>
      </h1>
      <List
        :articles="articles"
        :category="category"
        :pagination="pagination"
        @load-prev="loadPrev"
      />
    </template>
  </div>
</template>

<script lang="ts">
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { BlogArticle, BlogCategory, BlogUrlEntry } from 'icmaa-blog/types/BlogState'
import { Route } from 'vue-router'

import BlogMixin from 'icmaa-blog/mixins'
import BlogMetaMixin from 'icmaa-blog/mixins/meta'
import ArticleComponent from 'icmaa-blog/components/Article.vue'
import List from 'icmaa-blog/components/List.vue'

export default {
  name: 'BlogPage',
  components: {
    ArticleComponent,
    List
  },
  mixins: [ BlogMixin, BlogMetaMixin ],
  async asyncData (c) {
    c.context?.output.cacheTags
      .add('blog')
  },
  async serverPrefetch () {
    return (this as any).fetchData()
  },
  computed: {
    ...mapGetters({
      getArticle: 'icmaaBlog/getArticleByQuery',
      getResolvedUrl: 'icmaaBlog/getResolvedUrl',
      getResolvedUrlIds: 'icmaaBlog/getResolvedUrlIds',
      getCategoryBy: 'icmaaBlog/getCategoryBy',
      getCategories: 'icmaaBlog/getCategories'
    }),
    identifier (): string | null {
      const { params } = this.$route
      return params?.identifier || 'root'
    },
    page (): number | null {
      const { query } = this.$route
      return parseInt(query?.p || '1')
    },
    urlKey (): string {
      return this.isTag ? `tag-${this.tag}` : this.identifier
    },
    article (): BlogArticle | null {
      return this.getArticle({ identifier: this.identifier })
    },
    isArticle (): boolean {
      return !!this.article
    },
    articles (): BlogArticle[] {
      return this.getResolvedUrlIds(this.urlKey)
        .map(id => this.getArticle({ id }))
    },
    isCategory (): boolean {
      return !!this.category
    },
    category (): BlogCategory {
      if (this.isRoot) {
        return {
          name: i18n.t('Latest articles') as string,
          url: 'root',
          children: this.getCategories
        }
      }

      return this.getCategoryBy(this.identifier)
    },
    tag (): string {
      const { params } = this.$route
      return params?.tag
    },
    isTag (): boolean {
      return !!this.tag
    },
    isRoot (): boolean {
      return this.identifier === 'root'
    },
    pagination (): boolean | BlogUrlEntry {
      return this.getResolvedUrl(this.urlKey) || false
    }
  },
  watch: {
    identifier () {
      return this.fetchData()
    },
    page () {
      return this.fetchData()
    }
  },
  async mounted () {
    return this.fetchData()
  },
  methods: {
    async loadPrev () {
      const route = {
        ...this.$route,
        query: {
          p: this.pagination.start / this.pagination.perPage
        }
      }
      return this.$store.dispatch('icmaaBlog/resolveUrl', { route })
    },
    fetchData (route: Route) {
      return Promise.all([
        this.$store.dispatch('icmaaBlog/fetchCategories'),
        this.$store.dispatch('icmaaBlog/resolveUrl', { route: this.$route })
      ])
    }
  },
  metaInfo () {
    if (this.isArticle) {
      const { title, preview } = this.article
      return {
        ...this.getMetaInfo(true),
        title: `${title} | ${this.$t('Magazine')}`,
        meta: [
          { vmid: 'description', name: 'description', content: preview }
        ]
      }
    } else if (this.isCategory || this.isTag) {
      const title = this.isCategory
        ? `${this.category.name} | ${this.$t('Magazine')}`
        : `#${this.tag} | ${this.$t('Magazine')}`

      return { ...this.getMetaInfo(), title }
    }

    return {
      ...this.getMetaInfo(),
      title: this.$t('Magazine')
    }
  }
}
</script>
