<template>
  <div
    v-if="cmsData"
    class="t--mb-4 t-flex t-flex-wrap t-items-center t-justify-between md:t-justify-start"
  >
    <ul class="t-mb-4 t-mr-4 md:t-mr-8">
      <li
        v-for="(line, i) in signals"
        :key="i"
        class="t-flex t-text-xs t-font-light t-leading-4 t-text-base-light"
      >
        <material-icon
          icon="check"
          size="sm"
          class="t-mr-1 t-align-middle t-leading-4 t-text-primary"
        />
        {{ line }}
      </li>
    </ul>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'ProductTrustSignals',
  components: {
    MaterialIcon
  },
  computed: {
    ...mapGetters({
      'getCmsBlock': 'icmaaCmsBlock/getJsonBlockByIdentifier'
    }),
    cmsData () {
      return this.getCmsBlock('pdp-trust-signals')
    },
    signals () {
      return this.cmsData.trustSignals
    }
  }
}
</script>
