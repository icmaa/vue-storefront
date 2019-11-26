<template>
  <div class="competition t-container" v-if="competition">
    <div class="t-px-4 t-pt-4 t-mb-8">
      <h1>{{ competition.headline }}</h1>
      <div>{{ competition.description }}</div>
    </div>
    <form-component v-if="isActive" :form-elements="competition.form" @submit="submit" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isDatetimeInBetween } from 'icmaa-config/helpers/datetime'
import FormComponent from 'icmaa-competitions/components/Form'

export default {
  name: 'Competition',
  components: {
    FormComponent
  },
  data () {
    return {
      form: {}
    }
  },
  computed: {
    ...mapGetters({
      getCompetition: 'icmaaCompetitions/getByIdentifier'
    }),
    competition () {
      return this.getCompetition(this.$route.params.identifier)
    },
    isActive () {
      const { showFrom, showTo, enabled } = this.competition
      return enabled && isDatetimeInBetween(showFrom, showTo)
    }
  },
  methods: {
    submit () {
      console.log('SUBMIT')
    }
  },
  async asyncData ({ store, route, context }) {
    const value = route.params.identifier
    await store.dispatch('icmaaCompetitions/single', { value })
  }
}
</script>
