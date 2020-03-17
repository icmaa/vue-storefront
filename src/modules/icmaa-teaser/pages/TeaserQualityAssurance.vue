<template>
  <div class="t-container">
    <div class="t-p-2 t-py-8">
      <div class="t-flex t-flex-wrap">
        <base-select :options="typeOptions" name="type" id="type" v-model="type" label="View by" class="t-w-full lg:t-w-1/3 t-px-2 t-pb-4 lg:t-pb-0" />
        <base-select :options="tagOptions" name="tag" id="tag" v-model="tag" label="Tag" class="t-w-full lg:t-w-1/3 t-px-2 t-pb-4 lg:t-pb-0" v-show="type === 'tag'" />
        <base-select :options="customerclusterOptions" name="cluster" id="cluster" v-model="cluster" label="Cluster" class="t-w-full lg:t-w-1/3 t-px-2" v-show="type === 'cluster'" />
      </div>
      <lazy-hydrate when-visible v-for="(teaser, i) in teaserList" :key="'lazy-' + i + '-' + teaser.tags + '-' + teaser.customercluster">
        <div :key="'wrap-' + i + '-' + teaser.tags + '-' + teaser.customercluster" class="t-pt-8 t-px-2">
          <div v-if="type === 'cluster'" class="t-font-bold t-mb-4 t-text-1xl t-font-mono">
            {{ teaser.tagsLabel }}
          </div>
          <div v-if="type === 'tag'" class="t-font-bold t-mb-4 t-text-1xl t-font-mono">
            {{ teaser.customerclusterLabel }}
          </div>
          <teaser :tags="`${teaser.tags}`" :customercluster="`${teaser.customercluster}`" :show-small-in-row="teaser.inRow" class="t--mx-4" />
        </div>
      </lazy-hydrate>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'
import LazyHydrate from 'vue-lazy-hydration'

export default {
  name: 'TeaserQualityAssurance',
  components: {
    BaseSelect,
    Teaser,
    LazyHydrate
  },
  data () {
    return {
      type: '',
      tag: '',
      cluster: ''
    }
  },
  computed: {
    ...mapGetters({
      attributes: 'attribute/getAttributeListByCode',
      tags: 'icmaaTeaser/getTags'
    }),
    typeOptions () {
      return [
        { label: 'Cluster', value: 'cluster' },
        { label: 'Tag', value: 'tag' }
      ]
    },
    options () {
      return this.type === 'cluster' ? this.customerclusterOptions : this.tagOptions
    },
    tagOptions () {
      return this.tags.map(t => {
        t.label = `#${t.value} ${t.label}`
        return t
      })
    },
    customerclusterOptions () {
      if (!this.attributes.customercluster) {
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
            customerclusterLabel: c.label,
            inRow: this.showSmallInRow(this.tag)
          }
        })
      } else if (this.type === 'cluster' && this.cluster !== '') {
        return this.tagOptions.map(t => {
          return {
            tags: t.value,
            tagsLabel: t.label,
            customercluster: this.cluster,
            customerclusterLabel: this.getOptionLabel(this.customerclusterOptions, this.cluster),
            inRow: this.showSmallInRow(t.value)
          }
        })
      }

      return []
    }
  },
  methods: {
    getOptionLabel (options, value) {
      const option = options.find(o => o.value === value)
      return option ? option.label : value
    },
    showSmallInRow (tag) {
      return !['2'].includes(tag)
    }
  },
  async mounted () {
    const { cluster, tag } = this.$route.query
    if (cluster) {
      this.type = 'cluster'
      this.cluster = cluster
    } else if (tag) {
      this.type = 'tag'
      this.tag = tag
    }

    return Promise.all([
      this.$store.dispatch('attribute/list', { filterValues: [ 'customercluster' ] }),
      this.$store.dispatch('icmaaTeaser/fetchTags')
    ])
  }
}
</script>
