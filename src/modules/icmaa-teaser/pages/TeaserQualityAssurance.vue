<template>
  <div class="t-container">
    <div class="t-p-2 t-py-8">
      <h1 class="t-mb-4 t-px-2 t-text-1xl t-font-bold">
        Teaser Quality Assurance
      </h1>
      <no-ssr>
        <div class="t-mx-2 t-flex t-flex-wrap t-bg-white t-px-2 t-py-4">
          <base-select
            id="type"
            v-model="type"
            :options="typeOptions"
            name="type"
            label="View by"
            class="t-w-full t-px-2 t-pb-4 lg:t-w-1/3 lg:t-pb-0"
          />
          <base-select
            v-show="type === 'tag'"
            id="tag"
            v-model="tag"
            :options="tagOptions"
            name="tag"
            label="Tag"
            class="t-w-full t-px-2 t-pb-4 lg:t-w-1/3 lg:t-pb-0"
          />
          <base-select
            v-show="type === 'cluster'"
            id="cluster"
            v-model="cluster"
            :options="customerclusterOptions"
            name="cluster"
            label="Cluster"
            class="t-w-full t-px-2 t-pb-4 lg:t-w-1/3 lg:t-pb-0"
          />
          <base-checkbox
            id="showAsSplitTeaser"
            v-model="showAsSplitTeaser"
            name="showAsSplitTeaser"
            class="t-w-full t-px-2 lg:t-mt-6 lg:t-w-1/3"
          >
            Show small teaser as split-teaser
          </base-checkbox>
        </div>
      </no-ssr>
      <div
        v-for="(teaser, i) in teaserList"
        :key="getUniqueKey('wrap', i, teaser)"
        class="t-px-2 t-pt-8"
      >
        <div
          v-if="type === 'cluster'"
          class="t-mb-4 t-font-mono t-text-1xl t-font-bold"
        >
          {{ teaser.tagsLabel }}
        </div>
        <div
          v-if="type === 'tag'"
          class="t-mb-4 t-font-mono t-text-1xl t-font-bold"
        >
          {{ teaser.customerclusterLabel }}
        </div>
        <lazyload>
          <template v-slot:loading>
            <teaser-skeleton
              v-bind="{ isMobile, showSmallInRow: !showAsSplitTeaser }"
              class="t--mx-4"
            />
          </template>
          <teaser
            :key="getUniqueKey('teaser', i, teaser)"
            :tags="`${teaser.tags}`"
            :customercluster="`${teaser.customercluster}`"
            :show-small-in-row="!showAsSplitTeaser"
            :redirect-to-edit="true"
            class="t--mx-4"
          />
        </lazyload>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Lazyload from 'icmaa-cms/components/Lazyload'
import TeaserSkeleton from 'theme/components/core/blocks/Teaser/TeaserSkeleton'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import NoSSR from 'vue-no-ssr'

export default {
  name: 'TeaserQualityAssurance',
  components: {
    Lazyload,
    TeaserSkeleton,
    Teaser,
    BaseSelect,
    BaseCheckbox,
    'no-ssr': NoSSR
  },
  data () {
    return {
      type: '',
      tag: '',
      cluster: '',
      showAsSplitTeaser: false
    }
  },
  computed: {
    ...mapGetters({
      attributes: 'attribute/getAttributeListByCode',
      tags: 'icmaaTeaser/getTags',
      viewport: 'ui/getViewport'
    }),
    typeOptions () {
      return [
        { label: 'Cluster', value: 'cluster' },
        { label: 'Tag', value: 'tag' }
      ]
    },
    tagOptions () {
      return this.tags || []
    },
    customerclusterOptions () {
      if (!this.attributes.hasOwnProperty('customercluster')) {
        return []
      }

      return this.attributes.customercluster.options.map(o => {
        return { value: o.value, label: `#${o.value} ${o.label}` }
      })
    },
    teaserList () {
      if (this.type === 'tag' && this.tag !== '') {
        return this.customerclusterOptions.map(c => {
          return {
            tags: this.tag,
            tagsLabel: this.getOptionLabel(this.tagOptions, this.tag),
            customercluster: c.value,
            customerclusterLabel: c.label
          }
        })
      } else if (this.type === 'cluster' && this.cluster !== '') {
        return this.tagOptions.map(t => {
          return {
            tags: t.value,
            tagsLabel: t.label,
            customercluster: this.cluster,
            customerclusterLabel: this.getOptionLabel(this.customerclusterOptions, this.cluster)
          }
        })
      }

      return []
    },
    isMobile () {
      return ['xs', 'sm'].includes(this.viewport)
    }
  },
  mounted () {
    Promise.all([
      this.$store.dispatch('attribute/list', { filterValues: [ 'customercluster' ] }),
      this.$store.dispatch('icmaaTeaser/fetchTags')
    ]).then(() => {
      const { cluster, tag } = this.$route.query
      if (cluster) {
        this.type = 'cluster'
        this.cluster = cluster
      } else if (tag) {
        this.type = 'tag'
        this.tag = tag
      }
    })
  },
  methods: {
    getOptionLabel (options, value) {
      const option = options.find(o => o.value === value)
      return option ? option.label : value
    },
    getUniqueKey (prefix, index, teaser) {
      return [prefix, index, teaser.tags, teaser.customercluster].join('_')
    }
  }
}
</script>
