<template>
  <form
    novalidate
    class="form-component t--mx-2 t-flex t-flex-wrap t-pb-4"
    @submit.prevent="submit"
  >
    <template v-for="(element, i) in formElements">
      <div
        :key="i"
        class="t-mb-4 t-flex t-w-full t-px-2"
        :class="{ 'lg:t-w-1/2': ['half', 'half-single'].includes(element.width) }"
      >
        <template v-if="element.component === 'form_input'">
          <BaseInput
            :id="element.name"
            v-model="form[element.name]"
            :name="element.name"
            :label="element.label"
            :placeholder="element.placeholder"
            :mask="element.mask || undefined"
            :validations="validation[element.name]"
            class="t-w-full"
          />
        </template>
        <template v-else-if="element.component === 'form_textarea'">
          <BaseTextarea
            :id="element.name"
            v-model="form[element.name]"
            :name="element.name"
            :label="element.label"
            :placeholder="element.placeholder"
            :validations="validation[element.name]"
            class="t-w-full"
          />
        </template>
        <template v-else-if="element.component === 'form_checkbox'">
          <BaseCheckbox
            :id="element.name"
            v-model="form[element.name]"
            :name="element.name"
            :validations="validation[element.name]"
            :class="{ 'lg:t-mt-4': ['half', 'half-single'].includes(element.width) }"
            class="t-w-full"
          >
            <template v-if="containsHtml(element.label)">
              <component :is="stringToComponent(element.label)" />
            </template>
            <template v-else>
              {{ element.label }}
            </template>
          </BaseCheckbox>
        </template>
        <template v-else-if="element.component === 'form_select'">
          <BaseSelect
            :id="element.name"
            v-model="form[element.name]"
            :name="element.name"
            :label="element.label"
            :options="element.options"
            :validations="validation[element.name]"
            class="t-w-full"
          />
        </template>
        <template v-else-if="element.component === 'form_select_country'">
          <CountrySelect
            :id="element.name"
            v-model="form[element.name]"
            :name="element.name"
            :label="element.label"
            :validations="validation[element.name]"
            class="t-w-full"
          />
        </template>
      </div>
      <div
        v-if="['half-single'].includes(element.width)"
        :key="'spacer-' + i"
        class="lg:t-w-1/2"
      />
    </template>
    <div class="t-flex t-w-full t-px-2">
      <div
        v-if="recaptcha && $v.form.recaptcha.$error && !$v.form.recaptcha.required"
        class="t-mb-2 t-w-full t-text-sm t-text-alert"
      >
        {{ $t('Your Google reCAPTCHA validation is invalid.') }}<br>
        {{ $t('Please try again or contact our customer-support.') }}
      </div>
      <VueRecaptcha
        v-if="recaptcha"
        :sitekey="recaptchaWebsiteKey"
        :load-recaptcha-script="true"
        badge="inline"
        class="t-w-full"
        @verify="recaptchaVerify"
      >
        <ButtonComponent
          type="primary"
          class="t-mt-4 t-w-full lg:t-w-auto"
          @click="submit()"
        >
          {{ submitButtonText }}
        </ButtonComponent>
      </VueRecaptcha>
      <ButtonComponent
        v-else
        :submit="true"
        type="primary"
        class="t-flex-1 lg:t-flex-fix"
      >
        {{ submitButtonText }}
      </ButtonComponent>
    </div>
  </form>
</template>

<script>
import config from 'config'
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'
import { date, postcode, isTrue, regex } from 'icmaa-config/helpers/validators'
import { stringToComponent } from 'icmaa-cms/helpers'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseTextarea from 'theme/components/core/blocks/Form/BaseTextarea'
import CountrySelect from 'theme/components/core/blocks/Form/CountrySelect'
import ButtonComponent from 'theme/components/core/blocks/Button'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'FormComponent',
  components: {
    BaseInput,
    BaseSelect,
    BaseCheckbox,
    BaseTextarea,
    CountrySelect,
    ButtonComponent,
    VueRecaptcha
  },
  props: {
    formElements: {
      type: Array,
      required: true
    },
    submitButtonText: {
      type: String,
      default: i18n.t('Submit')
    },
    recaptcha: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      form: {},
      messages: {
        default: 'This isn\'t a valid field value.',
        email: 'Please provide valid e-mail address.',
        required: 'Field is required'
      }
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      customer: 'user/getCustomer'
    }),
    fields () {
      return this.formElements.map(element => {
        if (element.required && element.component !== 'form_checkbox' && !element.label.endsWith('*')) {
          element.label = element.label + ' *'
        }

        if (element.component === 'form_select') {
          element.options = element.options.map(o => {
            const { label, value } = o
            return { label, value }
          })
        }

        return element
      })
    },
    validator () {
      let validations = {}
      const textFields = ['form_input', 'form_textarea']
      this.fields.forEach(element => {
        let validation = {}
        if (element.required === true) {
          if (element.component === 'form_checkbox') {
            validation = Object.assign(validation, { isTrue })
          } else {
            validation = Object.assign(validation, { required })
          }
        }
        if (textFields.includes(element.component)) {
          if (element.name === 'email' || element.validation === 'email') {
            validation = Object.assign(validation, { email })
          } else if (element.validation === 'date') {
            validation = Object.assign(validation, { date })
          } else if (element.validation === 'postcode') {
            validation = Object.assign(validation, { postcode: postcode(this.countryId) })
          } else {
            const regexRule = regex(element.validation)
            validation = Object.assign(validation, { regexRule })
          }
        }

        validations[element.name] = validation
      })

      if (this.recaptcha) {
        validations.recaptcha = { required }
      }

      return validations
    },
    validation () {
      const messages = {}
      Object.keys(this.$v.form.$params).forEach(i => {
        let validation = []
        Object.keys(this.$v.form[i].$params).forEach(j => {
          validation.push({
            condition: !this.$v.form[i][j] && this.$v.form[i].$error,
            text: i18n.t(this.messages[j] || this.messages['default'])
          })
        })

        messages[i] = validation
      })

      this.fields.forEach(f => {
        if (!messages[f.name]) {
          messages[f.name] = []
        }
      })

      return messages
    },
    defaults () {
      let defaults = {}
      this.fields.forEach(element => {
        let value = ''
        if (element.component === 'form_select') {
          value = element.default || ''
        } else if (element.component === 'form_select_country') {
          value = currentStoreView().i18n.defaultCountry
        } else if (element.component === 'form_checkbox') {
          value = element.checked || undefined
        } else if (element.component === 'form_input' && element.name === 'email') {
          value = this.isLoggedIn ? this.customer.email : ''
        }
        defaults[element.name] = value
      })

      if (this.recaptcha) {
        defaults.recaptcha = ''
      }

      return defaults
    },
    countryId () {
      return this.form.country || currentStoreView().i18n.defaultCountry
    },
    recaptchaWebsiteKey () {
      return config.icmaa.googleRecaptcha.websiteKey || false
    }
  },
  watch: {
    form (data) {
      this.$emit('input', data)
    }
  },
  created () {
    this.form = this.defaults
  },
  methods: {
    containsHtml (string) {
      return /<\/?[a-z][\s\S]*>/i.test(string)
    },
    stringToComponent (string) {
      return stringToComponent(string)
    },
    submit () {
      if (this.recaptcha && !this.$v.form.recaptcha.$error && !this.$v.form.recaptcha.required) {
        return
      }

      this.$v.form.$touch()
      if (!this.$v.form.$invalid) {
        this.$emit('submit')
      }
    },
    recaptchaVerify (token) {
      this.form.recaptcha = token
      this.submit()
    }
  },
  validations () {
    return {
      form: this.validator
    }
  }
}
</script>
