<template>
  <div class="">
    <div
      v-if="type === 'color'"
      class="t-mb-4 t-flex t-flex-wrap"
    >
      <ColorSelector
        v-for="(option, index) in options"
        :key="index"
        :option="option"
        @change="changeFilter"
      />
    </div>
    <div
      v-else-if="type === 'gender'"
      class="t--mx-1 t-mb-4 t-flex t-flex-wrap"
    >
      <GenderSelector
        v-for="(option, index) in options"
        :key="index"
        :option="option"
        @change="changeFilter"
      />
    </div>
    <div
      v-else-if="type === 'shortList'"
      class="t-mb-4 t-flex t-flex-wrap"
    >
      <ShortListSelector
        :options="options"
        @change="changeFilter"
      />
    </div>
    <div
      v-else-if="['list', 'searchableList'].includes(type)"
      class="t-mb-4"
    >
      <ListSelector
        v-bind="$props"
        :searchable="type === 'searchableList'"
        :use-links="attributeKey === 'category'"
        @change="changeFilter"
      />
    </div>
    <div
      v-else-if="type === 'price'"
      class="t-mb-6"
    >
      <PriceSelector
        v-bind="$props"
        @change="changeFilter"
      />
    </div>
    <div
      v-else-if="type === 'sale'"
      class="t-mb-4 t-flex t-flex-wrap"
    >
      <SaleSelector
        v-for="(option, index) in options"
        :key="index"
        :option="option"
        class="t-mb-2"
        @change="changeFilter"
      />
    </div>
    <div
      v-else
      class="t-mb-4 t-flex t-flex-wrap"
    >
      <GenericSelector
        v-for="(option, index) in options"
        :key="index"
        :option="option"
        class="t-mb-2"
        :class="{ 't-mr-2': index !== option.length - 1 }"
        @change="changeFilter"
      />
    </div>
  </div>
</template>

<script>
import config from 'config'
import { IcmaaGoogleTagManagerExecutors } from 'icmaa-google-tag-manager/hooks'

import GenericSelector from 'theme/components/core/blocks/Category/Filter/GenericSelector'
import ShortListSelector from 'theme/components/core/blocks/Category/Filter/ShortListSelector'
import ListSelector from 'theme/components/core/blocks/Category/Filter/ListSelector'
import PriceSelector from 'theme/components/core/blocks/Category/Filter/PriceSelector'
import ColorSelector from 'theme/components/core/blocks/Category/Filter/ColorSelector'
import GenderSelector from 'theme/components/core/blocks/Category/Filter/GenderSelector'
import SaleSelector from 'theme/components/core/blocks/Category/Filter/SaleSelector'

export default {
  name: 'CategoryFilter',
  components: {
    GenericSelector,
    ShortListSelector,
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
      this.$store.dispatch('user/addSessionDataByCategoryFilter', filterVariant)
      IcmaaGoogleTagManagerExecutors.onProductListFilter({ filter: filterVariant })
    },
    getType (attributeKey) {
      const map = Object.entries(config.products.filterTypeMapping).find(f => f[1].includes(attributeKey))
      return map ? map[0] : false
    }
  }
}
</script>
