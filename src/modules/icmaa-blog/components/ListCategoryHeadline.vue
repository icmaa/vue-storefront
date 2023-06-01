<template>
  <Headline
    :level="level"
    class="t-mb-4 t-flex t-flex-wrap t-items-baseline t-pr-2 t-text-xl t-text-base-dark"
  >
    <router-link
      v-if="!isBlogPage"
      :to="category.url === 'root' ? localizedRoute({ name: 'icmaa-blog-home' }) : localizedRoute({ name: 'icmaa-blog', params: { identifier: category.url } })"
      :title="$t('Show all articles')"
      class="hover:t-underline"
    >
      {{ category.name }}
    </router-link>
    <template v-else>
      {{ category.name }}
    </template>
    <template v-if="category.children">
      <span class="t-my-1 t-ml-6 t-mr-3 t-hidden t-w-px t-self-stretch t-border-l t-border-base-dark md:t-block" />
      <div class="t-mt-2 t-flex t-w-full t-flex-wrap t-items-baseline t-border-l t-border-base-dark t-py-1 t-font-light md:t-mt-0 md:t-w-auto md:t-border-none md:t-py-0">
        <router-link
          v-for="c in category.children"
          :key="c.url"
          :to="localizedRoute({ name: 'icmaa-blog', params: { identifier: c.url } })"
          :title="c.name"
          class="t-px-3 t-text-base hover:t-underline"
        >
          {{ c.name }}
        </router-link>
      </div>
    </template>
  </Headline>
</template>

<script lang="ts">
import Headline from 'theme/components/core/blocks/Headline.vue'

export default {
  name: 'ListCategoryHeadline',
  components: {
    Headline
  },
  props: {
    category: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 1
    }
  },
  computed: {
    isBlogPage () {
      return this.$route.name.endsWith('icmaa-blog') || this.$route.name.endsWith('icmaa-blog-tag') || this.$route.name.endsWith('icmaa-blog-home')
    }
  }
}
</script>
