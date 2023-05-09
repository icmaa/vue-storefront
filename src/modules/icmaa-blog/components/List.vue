<template>
  <div class="t-container">
    <h1>{{ headline }}</h1>
    <div v-for="article in articles" :key="article.identifier" class="t-mb-8">
      <h2>{{ article.title }}</h2>
      <div>{{ date(article.firstPublishedAt) }}</div>
      <Asset :image="article.image" :width="100" />
      <div>{{ article.preview }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Asset from 'icmaa-cms/components/Storyblock/Asset.vue'
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
