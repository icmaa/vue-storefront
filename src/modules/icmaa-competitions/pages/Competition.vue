<template>
  <div>
    {{ competition.uname }}<br>
    Is active: {{ isActive }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isDatetimeInBetween } from 'icmaa-config/helpers/datetime'

export default {
  name: 'Competition',
  computed: {
    ...mapGetters({ getCompetition: 'icmaaCompetitions/getByIdentifier' }),
    competition () {
      return this.getCompetition(this.$route.params.identifier)
    },
    isActive () {
      const { showFrom, showTo, enabled } = this.competition
      return enabled && isDatetimeInBetween(showFrom, showTo)
    }
  },
  async asyncData ({ store, route, context }) {
    const value = route.params.identifier
    await store.dispatch('icmaaCompetitions/single', { value })
  }
}
</script>
