<template>
  <div>
    <h1
      v-if="headline"
      class="t-mb-8 t-pr-2 t-text-2xl t-font-light t-text-base-dark"
      v-text="headline"
    />
    <div class="t--m-4 t-flex t-cursor-pointer t-flex-wrap t-items-start">
      <router-link
        v-for="article in articles"
        :key="article.identifier"
        tag="div"
        class="t-mb-8 t-w-full t-px-4 md:t-w-1/2 lg:t-w-1/3"
        :to="{ name: 'icmaa-blog-articles', params: { identifier: article.identifier }}"
      >
        <div class="t-mb-6">
          <Asset
            :image="article.image"
            :sizes="[
              { media: '(min-width: 620px)', width: 394 },
              { media: '(min-width: 425px)', width: 352 },
              { media: '(max-width: 424px)', width: 394 }
            ]"
            :width="394"
          />
        </div>
        <h2 class="t-mb-2 t-text-base t-font-light t-text-primary">
          {{ article.title }}
        </h2>
        <div class="t-mb-4 t-flex t-flex-wrap t-items-center t-text-sm t-font-light">
          {{ article.firstPublishedAt | date }}
          <span
            v-for="t in article.tags"
            :key="t"
            class="t-ml-2 t-text-xs t-text-base-light"
          >
            {{ t | tag }}
          </span>
        </div>
        <div class="t-mb-2 t-text-sm t-leading-normal">
          {{ article.preview }}
        </div>
        <router-link
          :to="{ name: 'icmaa-blog-articles', params: { identifier: article.identifier }}"
          :title="article.title"
          class="t-text-sm t-font-bold"
        >
          {{ $t('Read more') }}
        </router-link>
      </router-link>
    </div>
    <div
      v-if="articles.length === 0"
      class="t-text-sm t-font-light"
    >
      {{ $t('No articles found') }}
    </div>
  </div>
</template>

<script lang="ts">
import BlogMixin from 'icmaa-blog/mixins'

export default {
  name: 'BlogList',
  mixins: [ BlogMixin ],
  props: {
    articles: {
      type: Array,
      required: true
    },
    headline: {
      type: String || Boolean,
      default: false
    }
  }
}
</script>
