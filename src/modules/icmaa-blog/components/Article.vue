<template>
  <div>
    <h1>{{ article.title }}</h1>
    <div>{{ article.firstPublishedAt | date }}</div>
    <Asset
      :image="article.image"
      :auto-reload="true"
    />
    <block-wrapper :components="article.content" />
    <List
      v-if="article.relatedArticles.length > 0"
      :articles="article.relatedArticles"
      :headline="$t('Related articles')"
    />
  </div>
</template>

<script lang="ts">
import BlogMixin from 'icmaa-blog/mixins'
import BlockWrapper from 'icmaa-cms/components/Wrapper.vue'
import List from 'icmaa-blog/components/List.vue'

export default {
  name: 'BlogArticle',
  components: {
    BlockWrapper,
    List
  },
  mixins: [ BlogMixin ],
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>
