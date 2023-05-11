<template>
  <div>
    <Navigation :items="categories || []" />
    <Article v-if="isArticle" :article="article" />
    <List v-else :articles="articles" :headline="isCategory ? category.name : identifier" />
  </div>
</template>

<script lang="ts">
import BlogMixin from 'icmaa-blog/mixins'
import Article from 'icmaa-blog/components/Article.vue'
import List from 'icmaa-blog/components/List.vue'
import Navigation from 'icmaa-blog/components/Navigation.vue'

export default {
  name: 'BlogPage',
  mixins: [ BlogMixin ],
  components: {
    Article,
    List,
    Navigation
  },
  async serverPrefetch () {
    return (this as any).fetchData()
  },
  async mounted () {
    return this.fetchData()
  },
  watch: {
    identifier () {
      return this.fetchData()
    }
  }
}
</script>
