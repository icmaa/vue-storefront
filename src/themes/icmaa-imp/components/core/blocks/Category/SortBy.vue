<template>
  <div class="sort-by">
    <ul>
      <li
        v-for="(sortOpt, i) in sortingOptions"
        :key="sortOpt.id || i"
        class="t-border-t t-border-base-lighter t-px-2 t-py-3"
      >
        <button
          class="t-flex t-w-full t-items-center t-justify-between t-text-sm"
          @click="sort(sortOpt)"
        >
          {{ $t('Sort by') }} {{ sortOpt.label }}
          <MaterialIcon
            v-if="currentOption && currentOption.id === sortOpt.id"
            icon="check"
            class="t-leading-1-rem"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { products } from 'config'
import { getCustomCategorySort } from 'icmaa-catalog/helpers/defaultCategorySort'
import i18n from '@vue-storefront/i18n'
import isEmpty from 'lodash-es/isEmpty'

import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'SortBy',
  components: {
    MaterialIcon
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
      isSearchResultPage: 'icmaaSearch/isSearchResultPage'
    }),
    sortingOptions () {
      let variants = []
      Object.keys(this.sortingConfigOptions).map(label => {
        variants.push({
          label: `${i18n.t(label)}`,
          id: this.sortingConfigOptions[label],
          type: 'sort'
        })
      })

      return variants
    },
    sortingConfigOptions () {
      return Object.assign(products.sortByAttributes, this.customConfigOptions)
    },
    customConfigOptions () {
      return getCustomCategorySort(this.category) || {}
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
  watch: {
    category () {
      this.initSelected()
    },
    routerSortParam () {
      this.initSelected()
    }
  },
  mounted () {
    this.initSelected()
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
    sort (opt) {
      this.selected = opt.id

      let currentOption = this.currentOption
      if (currentOption.id === 'reset') {
        currentOption.id = ''
      }

      this.$emit('change', currentOption)
    }
  }
}
</script>
