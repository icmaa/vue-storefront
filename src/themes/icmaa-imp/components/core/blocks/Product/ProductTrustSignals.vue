<template>
  <div class="t-flex t-flex-wrap t-items-center t-justify-between md:t-justify-start t--mb-4" v-if="cmsData">
    <ul class="t-mr-4 md:t-mr-8 t-mb-4">
      <li v-for="(line, i) in signals" :key="i" class="t-flex t-text-xs t-font-light t-text-base-light t-leading-4">
        <material-icon icon="check" size="sm" class="t-align-middle t-mr-1 t-text-primary t-leading-4" />
        {{ line }}
      </li>
    </ul>
    <google-customer-reviews-badge :score="googleScore" class="t-mb-4 t-cursor-pointer" @click="openGoogleReviews()" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import GoogleCustomerReviewsBadge from 'theme/components/core/blocks/Product/GoogleCustomerReviewsBadge'

export default {
  name: 'ProductTrustSignals',
  components: {
    MaterialIcon,
    GoogleCustomerReviewsBadge
  },
  computed: {
    ...mapGetters({
      'getCmsBlock': 'icmaaCmsBlock/getJsonBlockByIdentifier'
    }),
    cmsData () {
      return this.getCmsBlock('pdp-trust-signals')
    },
    googleScore () {
      return this.cmsData.google.score
    },
    googleLink () {
      return this.cmsData.google.link
    },
    signals () {
      return this.cmsData.trustSignals
    }
  },
  methods: {
    openGoogleReviews () {
      window.open(this.googleLink, '_blank')
    }
  }
}
</script>
