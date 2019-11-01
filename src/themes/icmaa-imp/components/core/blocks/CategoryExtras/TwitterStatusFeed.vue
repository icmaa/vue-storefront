<template>
  <div>
    <div v-for="(s, i) in status" :key="i">
      {{ s.text }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { registerModule, isModuleRegistered } from '@vue-storefront/core/lib/modules'
import { IcmaaTwitterModule } from 'icmaa-twitter'

export default {
  name: 'TwitterStatusFeed',
  props: {
    screenName: {
      type: String,
      required: true
    }
  },
  beforeCreate () {
    registerModule(IcmaaTwitterModule)
  },
  async mounted () {
    return this.$store.dispatch('icmaaTwitter/loadStatusFeed', this.screenName)
  },
  computed: {
    ...mapGetters({
      getStatus: 'icmaaTwitter/getStatusByScreenName'
    }),
    status () {
      return this.getStatus(this.screenName)
    }
  }
}
</script>
