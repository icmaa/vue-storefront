<template>
  <div>
    <pre>
    {{ article || articles }}
    </pre>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      articles: 'icmaaBlog/getArticles',
      getArticle: 'icmaaBlog/getArticleBy'
    }),
    article () {
      const { params } = this.$route
      return this.getArticle(params.identifier)
    }
  },
  async mounted () {
    await this.$store.dispatch('icmaaBlog/resolveUrl', { route: this.$route })
      .then(r => {
        console.error(r)
      })
  }
}
</script>
