import { mapGetters } from 'vuex'
import { BlogArticle as Article } from 'icmaa-blog/types/BlogState'

export default {
  computed: {
    ...mapGetters({
      getArticles: 'icmaaBlog/getArticlesBy',
      getArticle: 'icmaaBlog/getArticleBy'
    }),
    article (): Article {
      const { params } = this.$route
      return this.getArticle(params.identifier)
    },
    isArticle (): boolean {
      return !!this.article
    },
    articles (): Article[] {
      const { params } = this.$route
      return this.getArticles(params.identifier)
    }
  }
}
