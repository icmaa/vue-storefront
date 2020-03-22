<template>
  <div class="sort-by">
    <base-select name="sortby" v-model="selected" @change="sort" :options="sortingOptionsForSelect" :initial-option-text="$t('Sort By')" select-class="t-text-sm" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { products } from 'config'
import i18n from '@vue-storefront/i18n'
import { CategorySort } from '@vue-storefront/core/modules/catalog/components/CategorySort'
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
      category: 'category-next/getCurrentCategory'
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

      const categorySort = this.categorySortingConfigOptions.find(op => op.categoryId === this.category.id)
      if (categorySort && categorySort.categoryId === this.category.id && !variants.find(el => el.id === categorySort.sort)) {
        variants.push({
          label: categorySort.label,
          id: categorySort.sort,
          type: 'sort'
        })
      }
      return variants
    },
    sortingOptionsForSelect () {
      return this.sortingOptions
        .map(v => ({ label: `${i18n.t('Sort by')} ${i18n.t(v.label)}`, value: v.id }))
    },
    sortingConfigOptions () {
      return products.sortByAttributes
    },
    categorySortingConfigOptions () {
      return products.categorySortByAttributes
    },
    currentOption () {
      return this.sortingOptions.find(o => o.id === this.selected)
    }
  },
  mounted () {
    this.onMounted()
  },
  methods: {
    sort (value) {
      this.$emit('change', this.currentOption)
    },
    onMounted () {
      const defaultSortBy = this.category.default_sort_by || ''
      const categorySortBy = this.categorySortingConfigOptions.find(op => op.categoryId === this.category.id) || this.categorySortingConfigOptions.find(op => op.categoryId === this.category.parent_id)
      const sort = this.query && this.query.sort ? this.query.sort : null
      if ((sort && Object.values(this.sortingConfigOptions).includes(sort)) || (sort && this.categorySortingConfigOptions.find(el => el.sort === sort))) {
        this.selected = sort
      } else if (defaultSortBy && categorySortBy) {
        this.selected = categorySortBy.sort
        this.sort()
      } else {
        const { attribute, order } = products.defaultSortBy
        this.selected = `${attribute}:${order}`
      }
    }
  },
  watch: {
    '$route.params' () {
      this.onMounted()
    }
  }
}
</script>
