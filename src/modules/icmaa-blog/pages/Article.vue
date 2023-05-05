<template>
  <div>
    <pre>
    {{ articles }}
    </pre>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      articles: 'icmaaBlog/getArticles'
    })
  },
  async asyncData ({ store, route }) {
    await store.dispatch('icmaaBlog/list', { })
  },
  mounted () {
    this.$store.dispatch('icmaaBlog/list', { })
      .then(r => {
        console.error(r)
      })
  }
}
</script>
