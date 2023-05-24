<template>
  <div>
    <slot>
      <CategoryHeadline
        v-if="category || headline"
        :category="category || { name: headline }"
        :level="headlineLevel"
      />
    </slot>
    <div
      v-if="showPrevPagination"
      class="t-mb-4 t-flex t-items-center t-justify-center"
    >
      <a
        href="#"
        class="t-flex t-min-h-10 t-w-2/3 t-items-center t-justify-center t-rounded-sm t-border t-border-base-darkest t-bg-transparent t-px-4 t-text-xs t-uppercase t-text-base-darkest t-webkit-tap-transparent lg:t-w-1/4"
        @click.prevent="$emit('load-prev')"
      >
        {{ $t('Load previous') }}
      </a>
    </div>
    <div class="t--mx-4 t-flex t-cursor-pointer t-flex-wrap t-items-start">
      <router-link
        v-for="article in articles"
        :key="article.identifier"
        tag="div"
        class="t-mb-8 t-w-full t-px-4 md:t-w-1/2 lg:t-w-1/3"
        :to="{ name: 'icmaa-blog', params: { identifier: article.identifier }}"
      >
        <div class="t-mb-6">
          <Asset
            :asset="article.image"
            :sizes="[
              { media: 'sm', width: 394 },
              { media: 'xs', width: 352 },
              { width: 394 }
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
          :to="{ name: 'icmaa-blog', params: { identifier: article.identifier }}"
          :title="article.title"
          class="t-text-sm t-font-bold"
        >
          {{ $t('Read more') }}
        </router-link>
      </router-link>
    </div>
    <div
      v-if="showNextPagination"
      class="t-mb-8 t-flex t-items-center t-justify-center"
    >
      <a
        href="#"
        class="t-flex t-min-h-10 t-w-2/3 t-items-center t-justify-center t-rounded-sm t-border t-border-base-darkest t-bg-transparent t-px-4 t-text-xs t-uppercase t-text-base-darkest t-webkit-tap-transparent lg:t-w-1/4"
        @click.prevent="$emit('load-next')"
      >
        {{ $t('Load more') }}
      </a>
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
import CategoryHeadline from 'icmaa-blog/components/ListCategoryHeadline.vue'

export default {
  name: 'BlogList',
  components: {
    CategoryHeadline
  },
  mixins: [ BlogMixin ],
  props: {
    articles: {
      type: Array,
      required: true
    },
    category: {
      type: [Object, null],
      default: null
    },
    headline: {
      type: [String, null],
      default: null
    },
    headlineLevel: {
      type: Number,
      default: 2
    },
    pagination: {
      type: [Boolean, Object],
      default: false
    }
  },
  computed: {
    showPrevPagination (): boolean {
      if (!this.pagination) return false
      const { start } = this.pagination
      return start > 0
    },
    showNextPagination (): boolean {
      if (!this.pagination) return false
      const { perPage, total, start, ids } = this.pagination
      return total > perPage && (start + ids.length) < total
    }
  }
}
</script>
