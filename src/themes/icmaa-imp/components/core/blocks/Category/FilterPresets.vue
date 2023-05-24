<template>
  <div>
    <button-component
      v-for="(p, i) in presets"
      :key="'filter-' + i"
      size="sm"
      :icon="p.active ? 'clear' : false"
      class="t-mr-2 t-shrink-0 t-opacity-75 hover:t-opacity-100"
      @click.native="changeFilter(p)"
    >
      {{ p.label }}
    </button-component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import registerGenericCmsStateModule from 'icmaa-cms/helpers/genericStateModule'
import ButtonComponent from 'theme/components/core/blocks/Button'

import mapValues from 'lodash-es/mapValues'
import intersection from 'lodash-es/intersection'
import pick from 'lodash-es/pick'
import orderBy from 'lodash-es/orderBy'

export default {
  name: 'FilterPresets',
  components: {
    ButtonComponent
  },
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters({
      selectedFilters: 'category-next/getCurrentFilters',
      getAvailableFilters: 'category-next/getAvailableFilters',
      cluster: 'user/getCluster'
    }),
    rawPresets () {
      return this.$store.getters['icmaaCmsFilterPresets/getAll'] || []
    },
    formatedPresets () {
      return this.rawPresets.map(p => {
        let preset = pick(p, ['label', 'enabled', 'filters', 'clusters'])
        preset.filters = preset.filters.map(f => { return { type: f['attribute'], id: f['value'] } })
        return preset
      }).filter(p => p.enabled)
    },
    availableFilters () {
      return mapValues(this.getAvailableFilters, (v) => v.map(o => o.id))
    },
    allAvailableFilterIds () {
      return [].concat(...Object.values(this.availableFilters))
    },
    allSelectedFilterCodes () {
      return Object.keys(this.selectedFilters)
    },
    allSelectedFilterIds () {
      let filters = Object.values(this.selectedFilters).map(f => !Array.isArray(f) ? [f] : f)
      return [].concat(...filters).map(f => f.id)
    },
    presets () {
      let cluster = this.cluster
      let presets = this.formatedPresets
        .filter(p => {
          const filterIds = [].concat(...p.filters.map(f => f.id))
          return intersection(filterIds, this.allAvailableFilterIds).length === filterIds.length
        })
        .filter(p => (!p.clusters || p.clusters.length === 0 || (cluster && p.clusters.includes(cluster))))
        .map(preset => {
          preset.active = true
          const presetFilterCodes = preset.filters.map(f => f.type)
          const presetFilterIds = [].concat(...preset.filters.map(f => f.id))

          if (intersection(this.allSelectedFilterCodes, presetFilterCodes).length !== presetFilterCodes.length ||
            intersection(this.allSelectedFilterIds, presetFilterIds).length !== presetFilterIds.length ||
            this.allSelectedFilterIds.length !== presetFilterIds.length
          ) {
            preset.active = false
          }

          return preset
        })

      if (cluster) {
        presets = orderBy(presets, ['active', 'cluster'], ['desc', 'asc'])
      } else {
        presets = orderBy(presets, ['active'], ['desc'])
      }

      return presets
    }
  },
  beforeMount () {
    registerGenericCmsStateModule('filter-presets', 'filter-preset')
  },
  async mounted () {
    await this.$store.dispatch('icmaaCmsFilterPresets/list')
    this.loaded = true
  },
  methods: {
    async changeFilter (preset) {
      if (preset.active) {
        return this.$store.dispatch('category-next/resetSearchFilters')
      }

      let { filters } = preset
      if (!Array.isArray(filters)) {
        filters = [filters]
      }

      return this.$store.dispatch('category-next/setSearchFilters', filters)
    }
  }
}
</script>
