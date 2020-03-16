<template>
  <div class="t-container">
    <div class="t-flex t-flex-wrap t-p-2 t-py-8">
      <base-select :options="typeOptions" name="type" id="type" v-model="type" label="View by" class="t-w-full lg:t-w-1/3 t-px-2" />
      <base-select :options="options" name="value" id="value" v-model="current" :label="typeLabel" class="t-w-full lg:t-w-1/3 t-px-2" v-if="type" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import Teaser from 'theme/components/core/blocks/Teaser/Teaser'
import capitalize from 'lodash-es/capitalize'

export default {
  name: 'TeaserQualityAssurance',
  components: {
    BaseSelect,
    Teaser
  },
  data () {
    return {
      type: '',
      current: ''
    }
  },
  computed: {
    ...mapGetters({
      attributes: 'attribute/getAttributeListByCode',
      tag: 'icmaaTeaser/getTags'
    }),
    typeOptions () {
      return [
        { label: 'Cluster', value: 'cluster' },
        { label: 'Tag', value: 'tag' }
      ]
    },
    typeLabel () {
      return capitalize(this.type)
    },
    options () {
      return this.type === 'cluster' ? this.customerclusterOptions : this.tagOptions
    },
    tagOptions () {
      return this.tag
    },
    customerclusterOptions () {
      if (!this.attributes.customercluster) {
        return []
      }

      return this.attributes.customercluster.options.map(o => {
        return { value: o.value, label: `#${o.value} ${o.label}` }
      })
    }
  },
  async asyncData ({ store }) {
    return Promise.all([
      store.dispatch('attribute/list', { filterValues: [ 'customercluster' ] }),
      store.dispatch('icmaaTeaser/fetchTags')
    ])
  }
}
</script>
