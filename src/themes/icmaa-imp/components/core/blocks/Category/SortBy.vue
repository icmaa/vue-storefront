<template>
  <div class="sort-by">
    <base-select name="sortby" id="sortby" v-model="selected" @change="sort" :options="sortingOptionsForSelect" :initial-option-text="$t('Sort By')" :label="$t('Sort By')" :hide-label="true" select-class="t-text-sm" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { products } from 'config'
import { getCustomCategorySort } from 'icmaa-catalog/helpers/defaultCategorySort'
import i18n from '@vue-storefront/i18n'
import isEmpty from 'lodash-es/isEmpty'

import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'

export default {
  name: 'SortBy',
  components: {
    BaseSelect
  },
  data () {
    return {
      selected: undefined
    }
  },
  computed: {
    ...mapGetters({
      query: 'category-next/getCurrentSearchQuery',
      category: 'category-next/getCurrentCategory',
      isSearchResultPage: 'icmaaSearchAlias/isSearchResultPage'
    }),
    sortingOptions () {
      let variants = []
      Object.keys(this.sortingConfigOptions).map(label => {
        variants.push({
          label: label,
          id: this.sortingConfigOptions[label],
          type: 'sort'
        })
      })

      return variants
    },
    sortingOptionsForSelect () {
      return this.sortingOptions
        .map(v => ({ label: `${i18n.t('Sort by')} ${i18n.t(v.label)}`, value: v.id }))
    },
    sortingConfigOptions () {
      return Object.assign(products.sortByAttributes, this.customConfigOptions)
    },
    customConfigOptions () {
      /** Simulate category if we are on search-page to make use of universal `getCustomCategorySort` method. */
      const category = this.isSearchResultPage ? { id: 'search', parent_id: 'search' } : this.category
      return getCustomCategorySort(category) || {}
    },
    hasCustomConfigOptions () {
      return !isEmpty(this.customConfigOptions)
    },
    currentOption () {
      return this.sortingOptions.find(o => o.id === this.selected)
    },
    routerSortParam () {
      return this.query.sort
    }
  },
  mounted () {
    this.initSelected()
  },
  watch: {
    category () {
      this.initSelected()
    },
    routerSortParam () {
      this.initSelected()
    }
  },
  methods: {
    initSelected () {
      const sort = this.query && this.query.sort ? this.query.sort : null
      if (sort && Object.values(this.sortingConfigOptions).includes(sort)) {
        this.selected = sort
      } else {
        if (this.hasCustomConfigOptions) {
          this.selected = Object.values(this.customConfigOptions)[0]
        } else {
          const { attribute, order } = products.defaultSortBy
          this.selected = `${attribute}:${order}`
        }
      }
    },
    sort () {
      let currentOption = this.currentOption
      if (currentOption.id === 'reset') {
        currentOption.id = ''
      }

      this.$emit('change', currentOption)
    }
  }
}
</script>
