<template>
  <div class="competition t-container" v-if="competition">
    <div class="t-px-4 t-mb-8">
      <h1>{{ competition.headline }}</h1>
      <div>{{ competition.description }}</div>
    </div>
    <form v-if="isActive" @submit.prevent="submit" novalidate class="t-flex t-flex-wrap t-px-4 t--mx-2 t-pb-8">
      <div v-for="(element, i) in formElements" :key="i" class="t-flex t-w-1/2 t-px-2 t-mb-4">
        <template v-if="element.component === 'form_input'">
          <base-input
            :name="element.name"
            :id="element.name"
            :label="element.label"
            :placeholder="element.placeholder"
            v-model="form[element.name]"
            class="t-w-full"
          />
        </template>
        <template v-else-if="element.component === 'form_textarea'">
          <base-textarea
            :name="element.name"
            :id="element.name"
            :label="element.label"
            :placeholder="element.placeholder"
            v-model="form[element.name]"
            class="t-w-full"
          />
        </template>
        <template v-else-if="element.component === 'form_checkbox'">
          <base-checkbox
            :name="element.name"
            :id="element.name"
            v-model="form[element.name]"
            class="t-w-full"
          >
            {{ element.label }}
          </base-checkbox>
        </template>
        <template v-else-if="element.component === 'form_select'">
          <base-select
            :name="element.name"
            :id="element.name"
            :label="element.label"
            :options="element.options"
            v-model="form[element.name]"
            class="t-w-full"
          />
        </template>
      </div>
      <div class="t-flex t-w-full t-px-2">
        <button-component :submit="true" type="primary">
          {{ $t('Submit') }}
        </button-component>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isDatetimeInBetween } from 'icmaa-config/helpers/datetime'
import { required, email } from 'vuelidate/lib/validators'

import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseTextarea from 'theme/components/core/blocks/Form/BaseTextarea'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'Competition',
  components: {
    BaseInput,
    BaseSelect,
    BaseCheckbox,
    BaseTextarea,
    ButtonComponent
  },
  data () {
    return {
      form: {}
    }
  },
  computed: {
    ...mapGetters({ getCompetition: 'icmaaCompetitions/getByIdentifier' }),
    competition () {
      return this.getCompetition(this.$route.params.identifier)
    },
    isActive () {
      const { showFrom, showTo, enabled } = this.competition
      return enabled && isDatetimeInBetween(showFrom, showTo)
    },
    formElements () {
      return this.competition.formElements.map(element => {
        if (element.component === 'form_select') {
          element.options = element.options.map(o => {
            const { label, value } = o
            return { label, value }
          })
        }
        return element
      })
    },
    formValidation () {
      let validations = {}
      this.formElements.forEach(element => {
        let validation = {}
        if (element.required === true) {
          validation = Object.assign(validation, { required })
        }
        if (element.name === 'email') {
          validation = Object.assign(validation, { email })
        }

        validations[element.name] = validation
      })

      return validations
    },
    formDefaults () {
      let defaults = {}
      this.formElements.forEach(element => {
        let value = ''
        if (element.component === 'form_select') {
          value = element.default || ''
        } else if (element.component === 'form_checkbox') {
          value = element.checked || false
        }
        defaults[element.name] = value
      })

      return defaults
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      console.log(this.$v.form)
      if (!this.$v.form.$invalid) {
        console.log('SUBMIT')
      }
    }
  },
  validations () {
    return {
      form: this.formValidation
    }
  },
  mounted () {
    this.form = this.formDefaults
  },
  async asyncData ({ store, route, context }) {
    const value = route.params.identifier
    await store.dispatch('icmaaCompetitions/single', { value })
  }
}
</script>
