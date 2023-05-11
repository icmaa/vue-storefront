import { mapGetters } from 'vuex'
import { BlogArticle as Article, BlogCategory as Category } from 'icmaa-blog/types/BlogState'
import cloneDeep from 'lodash-es/cloneDeep'

export default {
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
    article (): Article {
      return this.getArticle(this.identifier)
    },
    isArticle (): boolean {
      return !!this.article
    },
    articles (): Article[] {
      return this.getResolvedUrlIds(this.identifier)
        .map(id => this.getArticle(id, 'id'))
    },
    flattenCategories (): Category[] {
      return this.flatten(this.categories || [])
    },
    isCategory (): boolean {
      return this.flattenCategories
        .map(c => c.url)
        .includes(this.identifier)
    },
    category (): Category {
      return this.flattenCategories.find(c => c.url === this.identifier)
    }
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
    flatten (items: Category[]) {
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
