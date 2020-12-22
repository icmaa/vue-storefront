<template>
  <div class="t-container t-p-4">
    <div class="t--mx-2">
      <look v-for="look in looks" :key="look.uid" :look="look" class="t-mx-2" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Look from 'icmaa-looks/components/Look'

export default {
  name: 'Looks',
  components: {
    Look
  },
  computed: {
    ...mapGetters({ looks: 'icmaaLooks/getLooks' })
  },
  async created () {
    await this.$store.dispatch('icmaaLooks/list', {})
  }
}
</script>
