<template>
  <ul class="t-ml-4">
    <li v-for="c in items" :key="c.url">
      <router-link
        :to="localizedRoute({ name: 'icmaa-blog-articles', params: { identifier: c.url } })"
        :title="c.name"
      >
        {{ c.name }}
      </router-link>
      <BlogNavigation v-if="c.children" :items="c.children" />
    </li>
  </ul>
</template>

<script lang="ts">
import BlogNavigation from 'icmaa-blog/components/Navigation.vue'

export default {
  name: 'BlogNavigation',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  components: {
    BlogNavigation
  }
}
</script>
