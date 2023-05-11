<template>
  <div class="t-container t-p-4">
    <h1 v-if="headline" v-text="headline" />
    <div v-for="article in articles" :key="article.identifier" class="t-mb-8">
      <h2>{{ article.title }}</h2>
      <div>{{ date(article.firstPublishedAt) }}</div>
      <Asset :image="article.image" :width="100" />
      <div>{{ article.preview }}</div>
      <router-link
        :to="{ name: 'icmaa-blog-articles', params: { identifier: article.identifier }}"
        :title="article.title"
      >
        {{ $t('Read more') }}
      </router-link>
    </div>
    <div v-if="articles.length === 0">
      {{ $t('No articles found') }}
    </div>
  </div>
</template>

<script lang="ts">
import Asset from 'icmaa-cms/components/Storyblok/Asset.vue'
import { toDate } from 'icmaa-config/helpers/datetime'

export default {
  name: 'BlogList',
  props: {
    articles: {
      type: Array,
      required: true
    },
    headline: {
      type: String || Boolean,
      default: false
    }
  },
  components: {
    Asset
  },
  methods: {
    date (d) {
      return toDate(d, undefined, undefined)
    }
  }
}
</script>
