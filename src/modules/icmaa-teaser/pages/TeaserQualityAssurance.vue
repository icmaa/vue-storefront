<template>
  <div class="t-container">
    <div class="t-p-2 t-py-8">
      <div class="t-flex t-flex-wrap">
        <base-select :options="typeOptions" name="type" id="type" v-model="type" label="View by" class="t-w-full lg:t-w-1/3 t-px-2" />
        <base-select :options="tagOptions" name="tag" id="tag" v-model="tag" label="Tag" class="t-w-full lg:t-w-1/3 t-px-2" v-show="type === 'tag'" />
        <base-select :options="customerclusterOptions" name="cluster" id="cluster" v-model="cluster" label="Cluster" class="t-w-full lg:t-w-1/3 t-px-2" v-show="type !== ''" />
      </div>
      <pre v-for="(teaser, i) in teaserList" :key="i">
        {{ teaser }}
      </pre>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'

export default {
  name: 'TeaserQualityAssurance',
  components: {
    BaseSelect,
    Teaser
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
      return this.tags
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
      if (this.type === 'tag') {
        return this.customerclusterOptions.map(c => {
          return { tag: this.tag, customercluster: c }
        })
      } else if (this.type === 'cluster') {
        return this.tagOptions.map(t => {
          return { tag: t, customercluster: this.cluster }
        })
      }

      return []
    }
  },
  async mounted () {
    return Promise.all([
      this.$store.dispatch('attribute/list', { filterValues: [ 'customercluster' ] }),
      this.$store.dispatch('icmaaTeaser/fetchTags')
    ])
  }
}
</script>
