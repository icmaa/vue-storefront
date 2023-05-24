<template>
  <JsonLd :dto="jsonld" />
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import { BlogArticle } from 'icmaa-blog/types/BlogState'
import { toDayjsDate } from 'icmaa-config/helpers/datetime'

import JsonLd from './JsonLdContainer.vue'

export default {
  name: 'JsonLdArticle',
  components: {
    JsonLd
  },
  computed: {
    ...mapGetters({
      getArticle: 'icmaaBlog/getArticleByQuery'
    }),
    identifier (): string {
      const { params } = this.$route
      return params.identifier
    },
    article (): BlogArticle | null {
      return this.getArticle({ identifier: this.identifier })
    },
    publishedAt (): string {
      return toDayjsDate(this.article.createdAt).toISOString()
    },
    modifiedAt (): string {
      return toDayjsDate(this.article.firstPublishedAt).toISOString()
    },
    author (): string {
      const { firstname, lastname } = this.article.author
      return `${firstname} ${lastname}`
    },
    jsonld () {
      return {
        '@context': 'https://schema.org/',
        '@type': 'NewsArticle',
        'headline': this.article.title,
        'image': [
          this.article.image.filename
        ],
        'datePublished': this.modifiedAt,
        'dateModified': this.publishedAt,
        'author': [
          {
            '@type': 'Person',
            'name': this.author
          }
        ]
      }
    }
  }
}
</script>
