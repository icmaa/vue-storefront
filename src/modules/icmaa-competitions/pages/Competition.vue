<template>
  <div class="competition t-container" v-if="competition">
    <div class="t-px-4 t-pt-4 t-mb-8">
      <div class="t-bg-white t-p-4">
        <h1 class="t-text-xl t-mb-1 t-font-bold" v-text="competition.headline" />
        <component :is="description" class="t-text-sm t-leading-relaxed t-text-base-tone" />
      </div>
    </div>
    <form-component v-if="isActive" :form-elements="competition.form" :submit-button-text="$t('Submit') + (competition.disclaimer ? ' *' : '')" @submit="submit" />
    <div v-if="isActive && competition.disclaimer" class="t-px-4 t-pt-4 t-pb-8 t-text-sm t-text-base-light">
      <material-icon icon="asterisk" icon-set="icmaa" size="xxs" class="t-mr-1" /> {{ competition.disclaimer }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isDatetimeInBetween } from 'icmaa-config/helpers/datetime'
import { stringToComponent } from 'icmaa-cms/helpers'

import FormComponent from 'icmaa-competitions/components/Form'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'Competition',
  components: {
    FormComponent,
    MaterialIcon
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
    },
    description () {
      return stringToComponent(this.competition.description)
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
