<template>
  <div class="t-container t-my-8" v-if="notEmpty">
    <div class="t-flex t-flex-wrap t--mx-4 t-px-4">
      <h1 class="t-px-4 t-mb-3 t-text-2xl t-font-medium t-leading-5">
        {{ category.name }}
      </h1>
      <div class="t-w-full">
        <teaser :tags="teaserTag" :show-large="false" :show-small-in-row="true" />
      </div>
    </div>
    <logo-line :parent-id="categoryId" :limit="12" :placeholder="true" column-class="t-w-1/3 md:t-w-1/6 t-py-2" class="t-justify-between t-my-8 t-px-4" />
    <list :category-id="categoryId" :depth="depth" />
    <lazyload>
      <product-listing-widget appearance="t-px-3 lg:t-px-4 t-mt-2" :category-id="3278" :limit="8" :filter="{ department }" />
    </lazyload>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { htmlDecode } from '@vue-storefront/core/lib/store/filters'

import Lazyload from 'icmaa-cms/components/Lazyload'
import List from 'icmaa-category/components/List/List'
import LogoLine from 'theme/components/core/blocks/CategoryExtras/LogoLine'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'
import ProductListingWidget from 'icmaa-category/components/ProductListingWidget'

export default {
  name: 'IcmaaCategoryList',
  components: {
    Lazyload,
    List,
    Teaser,
    LogoLine,
    ProductListingWidget
  },
  computed: {
    ...mapGetters({
      listByParentId: 'icmaaCategory/listByParentId'
    }),
    categoryId () {
      return Number(this.$route.params.parentCategoryId)
    },
    depth () {
      return Number(this.$route.params.depth || this.$route.query.depth) || undefined
    },
    list () {
      return this.listByParentId(this.categoryId)
    },
    notEmpty () {
      return (this.list && this.list.items)
    },
    category () {
      return this.list.category
    },
    teaserTag () {
      return String(this.$route.params.teaserTag)
    },
    department () {
      return String(this.$route.params.department)
    }
  },
  async asyncData ({ store, route, context }) {
    if (context) {
      context.output.cacheTags
        .add('category')
        .add('cms')
    }

    await store.dispatch(
      'icmaaCategory/list',
      {
        id: route.params.parentCategoryId,
        depth: route.params.depth || route.query.depth
      }
    )
  },
  metaInfo () {
    return !this.notEmpty || {
      title: htmlDecode(this.category.meta_title || this.category.name),
      meta: this.category.meta_description
        ? [{ vmid: 'description', name: 'description', content: htmlDecode(this.category.meta_description) }]
        : []
    }
  }
}
</script>
