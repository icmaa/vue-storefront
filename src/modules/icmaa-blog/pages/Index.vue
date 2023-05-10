<template>
  <div>
    <Article v-if="isArticle" :article="article" />
    <List v-else :articles="articles" headline="asdasd" />
  </div>
</template>

<script lang="ts">
import BlogMixin from 'icmaa-blog/mixins'
import Article from 'icmaa-blog/components/Article.vue'
import List from 'icmaa-blog/components/List.vue'

export default {
  name: 'BlogPage',
  mixins: [ BlogMixin ],
  components: {
    Article,
    List
  },
  async mounted () {
    await this.$store.dispatch('icmaaBlog/resolveUrl', { route: this.$route })
      .then(r => {
        if (r.items.length === 0) {
          this.$router.replace(this.localizedRoute({ name: 'page-not-found' }))
        }
      })
  }
}
</script>
