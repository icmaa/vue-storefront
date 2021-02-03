<template>
  <div id="category-list" class="t-container t-my-8" v-if="notEmpty">
    <div class="t-flex t-flex-wrap t--mx-4 t-px-4">
      <h1 class="t-px-4 t-mb-3 t-text-2xl t-font-medium t-leading-5">
        {{ category.name }}
      </h1>
      <div class="t-w-full">
        <teaser :tags="teaserTag" :show-large="false" :show-small-in-row="true" />
      </div>
    </div>
    <lazy-hydrate when-idle>
      <logo-line :parent-id="rootCategoryId" :limit="12" :placeholder="true" column-class="t-w-1/3 md:t-w-1/6 t-py-2" class="t-justify-between t-my-8 t-px-4" />
    </lazy-hydrate>
    <ul class="slingrope t-flex t-overflow-auto t-scrolling-touch t-mx-4">
      <li :key="letter.letter" v-for="letter in categoriesGroupedByFirstLetter">
        <a :href="`#${ letter.anchor }`" v-html="letter.letter" v-scroll-to="`#${ letter.anchor }`" class="t-flex t-px-4 t-py-2 t-bg-white t-border-r t-border-b t-border-base-lightest t-font-mono" />
      </li>
    </ul>
    <ul class="letters t-px-6">
      <template v-for="letter in categoriesGroupedByFirstLetter">
        <lazy-hydrate :key="`lazy-${rootCategoryId}-${letter.letter}`" when-visible>
          <letter :key="`${rootCategoryId}-${letter.letter}`" :id="letter.anchor" :letter="letter" class="t-p-4 t-py-8 t-bg-white t-my-4 t-flex t--mx-2" />
        </lazy-hydrate>
      </template>
    </ul>
    <lazy-hydrate>
      <product-listing-widget appearance="t-px-3 lg:t-px-4 t-mt-2" :category-id="3278" :limit="8" :filter="{ department }" />
    </lazy-hydrate>
  </div>
  <div v-else>
    No landing page found for ID {{ rootCategoryId }}
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { htmlDecode } from '@vue-storefront/core/lib/store/filters'
import { extractPrefix } from '../helpers'

import LazyHydrate from 'vue-lazy-hydration'
import Letter from 'icmaa-category/components/List/Letter'
import LogoLine from 'theme/components/core/blocks/CategoryExtras/LogoLine'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'
import ProductListingWidget from 'icmaa-category/components/ProductListingWidget'

export default {
  name: 'IcmaaCategoryList',
  components: {
    LazyHydrate,
    Letter,
    Teaser,
    LogoLine,
    ProductListingWidget
  },
  computed: {
    ...mapGetters({
      listByParentId: 'icmaaCategory/listByParentId'
    }),
    rootCategoryId () {
      return Number(this.$route.params.parentCategoryId)
    },
    depth () {
      return Number(this.$route.params.depth || this.$route.query.depth) || undefined
    },
    list () {
      return this.listByParentId(this.rootCategoryId)
    },
    category () {
      return this.list.category
    },
    notEmpty () {
      return (this.list && this.list.items)
    },
    categoriesGroupedByFirstLetter () {
      let groups = []

      this.list.items.forEach(category => {
        let firstChar = extractPrefix(category.name).charAt(0)
        let letter = /^[a-z]/gmi.test(firstChar) ? firstChar.toUpperCase() : '#'

        if (!groups.find(g => g.letter === letter)) {
          let anchor = letter !== '#' ? letter.toLowerCase() : 'numbers'
          groups.push({ letter, anchor, items: [] })
        }

        groups[groups.findIndex(g => g.letter === letter)].items.push(category)
      })

      return groups
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

<style lang="scss">

#category-list {
  .letters li > ul {
    @media (min-width: 767px) {
      column-count: 5;
      column-gap: 2rem;
      break-inside: avoid;
    }
  }
}
</style>
