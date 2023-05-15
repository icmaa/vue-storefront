<template>
  <h1 class="t-mb-8 t-flex t-flex-wrap t-items-baseline t-pr-2 t-text-2xl t-font-light t-text-base-dark">
    {{ category.name }}
    <template v-if="category.children">
      <span class="t-my-1 t-ml-6 t-mr-3 t-hidden t-w-px t-self-stretch t-border-l t-border-base-dark md:t-block" />
      <div class="t-mt-2 t-flex t-w-full t-flex-wrap t-items-baseline t-border-l t-border-base-dark t-py-1 md:t-mt-0 md:t-w-auto md:t-border-none md:t-py-0">
        <router-link
          v-for="c in category.children"
          :key="c.url"
          :to="localizedRoute({ name: 'icmaa-blog-articles', params: { identifier: c.url } })"
          class="t-px-3 t-text-base"
        >
          {{ c.name }}
        </router-link>
      </div>
    </template>
  </h1>
</template>

<script lang="ts">
export default {
  name: 'ListCategoryHeadline',
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script>
