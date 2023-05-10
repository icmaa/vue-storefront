<template>
  <div class="t-container t-p-4">
    <h1>{{ article.title }}</h1>
    <div>{{ date(article.firstPublishedAt) }}</div>
    <Asset :image="article.image" :width="100" />
    <block-wrapper :components="article.content" />
  </div>
</template>

<script lang="ts">
import Asset from 'icmaa-cms/components/Storyblok/Asset.vue'
import BlockWrapper from 'icmaa-cms/components/Wrapper.vue'
import { toDate } from 'icmaa-config/helpers/datetime'

export default {
  name: 'BlogArticle',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  components: {
    Asset,
    BlockWrapper
  },
  methods: {
    date (d) {
      return toDate(d, undefined, undefined)
    }
  }
}
</script>
