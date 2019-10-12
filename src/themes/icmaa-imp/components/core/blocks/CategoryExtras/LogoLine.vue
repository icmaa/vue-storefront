<template>
  <div class="t-flex t-flex-wrap t-justify-between">
    <department-logo v-for="(logo, index) in logoLineItems" :key="index" v-bind="logo.data()" class="t-flex-fix t-opacity-75 hover:t-opacity-100" :class="{ 't-mr-4': (index - 1 === logoLineItems.length)}" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import sampleSize from 'lodash-es/sampleSize'

import DepartmentLogo from 'theme/components/core/blocks/CategoryExtras/DepartmentLogo'

export default {
  components: {
    DepartmentLogo
  },
  data: function () {
    return {
      categories: []
    }
  },
  props: {
    parentId: {
      type: Number,
      required: true
    },
    limit: {
      type: Number,
      default: 5
    }
  },
  async mounted () {
    await this.$store.dispatch('icmaaCategoryExtras/loadDepartmentLogos')
    await this.$store.dispatch('icmaaCategoryExtras/loadChildCategoryIdMap', [ this.parentId ])
    await this.$store.dispatch('icmaaCategoryExtras/list', this.randomDepartmentLogoIdentifier.join(','))

    const categorySearchOptions = { filters: { 'url_key': this.randomDepartmentLogoIdentifier } }
    this.categories = await this.$store.dispatch('category-next/loadCategories', categorySearchOptions)
  },
  computed: {
    ...mapGetters('icmaaCategoryExtras', [ 'getCategoryChildrenMap', 'getDepartmentLogos', 'getLogolineItems' ]),
    ...mapGetters({ cluster: 'user/getCluster' }),
    categoryChildrenMap () {
      return this.getCategoryChildrenMap(this.parentId)
    },
    childrenIdentifier () {
      if (this.categoryChildrenMap) {
        return this.categoryChildrenMap.children.map(c => c.url_key)
      }

      return []
    },
    randomDepartmentLogoIdentifier () {
      const logos = this.getDepartmentLogos
        .filter(logo => {
          return (this.cluster ? (logo.customerCluster.includes(this.cluster) || logo.customerCluster.length === 0) : true) &&
            this.childrenIdentifier.includes(logo.identifier)
        })
        .map(l => l.identifier)

      return sampleSize(logos, this.limit)
    },
    logoLineItems () {
      return this.getLogolineItems(this.categories)
    }
  }
}
</script>
