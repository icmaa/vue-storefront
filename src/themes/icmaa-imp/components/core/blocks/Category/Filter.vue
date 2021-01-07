<template>
  <div class="filter">
    <div class="t-flex t-flex-wrap t-mb-4" v-if="type === 'color'">
      <color-selector v-for="(option, index) in options" :key="index" :option="option" @change="changeFilter" />
    </div>
    <div class="t-flex t-flex-wrap t-mb-4 t--mx-1" v-else-if="type === 'gender'">
      <gender-selector v-for="(option, index) in options" :key="index" :option="option" @change="changeFilter" />
    </div>
    <div class="t-mb-6" v-else-if="type === 'price'">
      <price-selector v-bind="$props" @change="changeFilter" />
    </div>
    <div class="t-flex t-flex-wrap t-mb-4" v-else-if="type === 'sale'">
      <sale-selector v-for="(option, index) in options" :key="index" :option="option" @change="changeFilter" class="t-mb-2" />
    </div>
    <div class="t-mb-4" v-else-if="['list', 'searchableList'].includes(type)">
      <list-selector v-bind="$props" @change="changeFilter" :searchable="type === 'searchableList'" :use-links="attributeKey === 'category'" />
    </div>
    <div class="t-flex t-flex-wrap t-mb-4" v-else>
      <generic-selector v-for="(option, index) in options" :key="index" :option="option" @change="changeFilter" class="t-mb-2" :class="{ 't-mr-2': index !== option.length - 1 }" />
    </div>
  </div>
</template>

<script>
import config from 'config'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'

import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector'
import ListSelector from 'theme/components/core/blocks/Category/Filter/ListSelector'
import PriceSelector from 'theme/components/core/blocks/Category/Filter/PriceSelector'
import ColorSelector from 'theme/components/core/blocks/Category/Filter/ColorSelector'
import GenderSelector from 'theme/components/core/blocks/Category/Filter/GenderSelector'
import SaleSelector from 'theme/components/core/blocks/Category/Filter/SaleSelector'

export default {
  name: 'CategoryFilter',
  components: {
    GenericSelector,
    ListSelector,
    PriceSelector,
    ColorSelector,
    GenderSelector,
    SaleSelector
  },
  props: {
    attributeKey: {
      type: String,
      required: true
    },
    attributeLabel: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: true
    }
  },
  computed: {
    type () {
      return this.getType(this.attributeKey)
    }
  },
  methods: {
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [ filterVariant ])
      IcmaaGoogleTagManagerExecutors.onProductListFilter({ filter: filterVariant })
    },
    getType (attributeKey) {
      const map = Object.entries(config.products.filterTypeMapping).find(f => f[1].includes(attributeKey))
      return map ? map[0] : false
    }
  }
}
</script>
