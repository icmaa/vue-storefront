<template>
  <div class="t-fixed t-bottom-0 t-z-10 t-left-0 t-bg-white t-shadow t-p-4">
    <select class="t-border t-bg-white" @change="changeCluster" v-model="clusterSelect">
      <option v-for="(option, i) in clusterAttributeOptions" :key="'option-' + i" :value="option.value" :selected="cluster === option.value || clusterString === option.label ? 'selected' : ''">
        {{ option.label }} - {{ option.value }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ClusterDebug',
  data () {
    return {
      clusterSelect: false
    }
  },
  computed: {
    ...mapGetters({
      cluster: 'user/getCluster',
      clusterString: 'user/getClusterString',
      attributes: 'attribute/getAttributeListByCode'
    }),
    clusterAttribute () {
      return Object.values(this.attributes).find(a => a.attribute_code === 'customercluster')
    },
    clusterAttributeOptions () {
      return this.clusterAttribute ? this.clusterAttribute.options : []
    }
  },
  methods: {
    changeCluster () {
      this.$store.dispatch('user/setCluster', this.clusterSelect)
    }
  },
  async mounted () {
    return this.$store.dispatch('attribute/list', { filterValues: ['customercluster'] })
  }
}
</script>
