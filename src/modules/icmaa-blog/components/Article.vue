<template>
  <div>
    <div class="t-mb-4 md:t-mb-6">
      <Asset
        :image="article.image"
        :sizes="[
          { media: '(min-width: 1024px)', width: 1248 },
          { media: '(min-width: 768px)', width: 992 },
          { media: '(min-width: 425px)', width: 736 },
          { media: '(max-width: 424px)', width: 394 }
        ]"
        :width="394"
      />
    </div>
    <div class="t-mb-8 t-flex t-max-w-3xl t-flex-wrap t-items-start t-justify-between lg:t-mx-auto">
      <div class="t-mb-4 t-flex t-grow t-flex-wrap t-items-center t-text-sm t-font-light sm:t-mb-0">
        <div class="t-mr-4 t-w-full sm:t-w-auto">
          {{ article.firstPublishedAt | date }}
          {{ $t('by {author}', { author: article.author.firstname }) }}
        </div>
        <div class="t-grow">
          <router-link
            v-for="identifier in article.categories"
            :key="identifier"
            :to="localizedRoute({ name: 'icmaa-blog', params: { identifier }})"
            class="t-mr-2 t-text-xs t-text-base-light hover:t-underline"
          >
            {{ identifier | tag }}
          </router-link>
          <router-link
            v-for="tag in article.tags"
            :key="tag"
            :to="localizedRoute({ name: 'icmaa-blog-tag', params: { tag }})"
            class="t-mr-2 t-text-xs t-text-base-light hover:t-underline"
          >
            {{ tag | tag }}
          </router-link>
        </div>
      </div>
      <web-share
        :webshare-text="webshareText"
        :webshare-image="article.image.filename"
        class="t-flex-fix"
      />
    </div>
    <h1 class="t-mb-4 t-flex t-max-w-3xl t-flex-wrap t-items-baseline t-text-2xl t-font-light t-text-base-dark lg:t-mx-auto">
      {{ article.title }}
    </h1>
    <block-wrapper
      :components="article.content"
      class="block-article__content"
    />
    <List
      v-if="article.relatedArticles.length > 0"
      :articles="article.relatedArticles"
      :headline="$t('Related articles')"
      class="t-mt-8"
    />
    <json-ld-loader type="article" />
  </div>
</template>

<script lang="ts">
import i18n from '@vue-storefront/i18n'
import BlogMixin from 'icmaa-blog/mixins'
import BlockWrapper from 'icmaa-cms/components/Wrapper.vue'
import List from 'icmaa-blog/components/List.vue'
import WebShare from 'theme/components/core/blocks/WebShare.vue'
import JsonLdLoader from 'icmaa-google-tag-manager/components/jsonld/JsonLdLoader.vue'

export default {
  name: 'BlogArticle',
  components: {
    BlockWrapper,
    List,
    WebShare,
    JsonLdLoader
  },
  mixins: [ BlogMixin ],
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    webshareText () {
      return i18n.t(
        'Checkout this out: {title}',
        { title: this.article.title }
      )
    },
    image () {
      return this.article.image
    }
  }
}
</script>

<style lang="scss">

.block-article__content {
  p, ul, ol, blockquote {
    &:not(:last-child) {
      @apply t-mb-4;
    }
  }

  & > .rte, & > .text, & > .headline {
    @apply t-max-w-3xl lg:t-mx-auto lg:t-px-0;
  }
}

</style>
