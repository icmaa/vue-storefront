<template>
  <div data-test-id="Register">
    <div class="modal-content">
      <form
        novalidate
        class="t--mx-2 t-flex t-flex-wrap"
        @submit.prevent="validate"
      >
        <input
          type="hidden"
          name="cluster"
          :value="cluster"
        >
        <base-input
          id="email"
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          focus
          :placeholder="$t('E-mail address') + ' *'"
          :validations="[
            {
              condition: !$v.email.required && $v.email.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.email.email && $v.email.$error,
              text: $t('Please provide valid e-mail address.')
            }
          ]"
          class="t-mb-4 t-w-full t-px-2"
        />
        <base-input
          id="first-name"
          v-model="firstName"
          name="first-name"
          autocomplete="given-name"
          :placeholder="$t('First name') + ' *'"
          :validations="[
            {
              condition: !$v.firstName.required && $v.firstName.$error,
              text: $t('Field is required')
            }
          ]"
          class="t-mb-4 t-w-full t-px-2 sm:t-w-1/2"
        />
        <base-input
          id="last-name"
          v-model="lastName"
          name="last-name"
          autocomplete="family-name"
          :placeholder="$t('Last name') + ' *'"
          :validations="[{
            condition: !$v.lastName.required && $v.lastName.$error,
            text: $t('Field is required')
          }]"
          class="t-mb-4 t-w-full t-px-2 sm:t-w-1/2"
        />
        <gender-select
          id="gender"
          v-model="gender"
          name="gender"
          :initial-option-text="$t('Gender') + ' *'"
          :validations="[{
            condition: !$v.gender.required && $v.gender.$error,
            text: $t('Field is required')
          }]"
          class="t-mb-4 t-w-full t-px-2 sm:t-w-1/2"
        />
        <base-input
          id="dob"
          v-model="dob"
          name="dob"
          autocomplete="bday"
          mask="date"
          :placeholder="`${$t('Date of birth')} (${dateFormat}) *`"
          :validations="[
            {
              condition: !$v.dob.required && $v.dob.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.dob.date && $v.dob.$error,
              text: $t('Use a valid date.')
            }
          ]"
          class="t-mb-4 t-w-full t-px-2 sm:t-w-1/2"
        />
        <base-input
          id="password"
          ref="password"
          v-model="password"
          type="password"
          name="password"
          autocomplete="new-password"
          :placeholder="$t('Password') + ' *'"
          :validations="[
            {
              condition: !$v.password.required && $v.password.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.password.minLength && $v.password.$error,
              text: $t('Password must have at least 8 letters.')
            }
          ]"
          class="t-mb-4 t-w-full t-px-2 sm:t-w-1/2"
        />
        <base-input
          id="password-confirm"
          v-model="rPassword"
          type="password"
          name="password-confirm"
          autocomplete="new-password"
          :placeholder="$t('Repeat password') + ' *'"
          :validations="[
            {
              condition: !$v.rPassword.required && $v.rPassword.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.rPassword.sameAsPassword && $v.rPassword.$error,
              text: $t('Passwords must be identical.')
            }
          ]"
          class="t-mb-4 t-w-full t-px-2 sm:t-w-1/2"
        />
        <base-checkbox
          id="newsletter"
          v-model="newsletter"
          name="newsletter"
          class="t-mb-4 t-w-full t-px-2"
          data-test-id="newsletterCheckbox"
        >
          {{ $t('I want to receive a newsletter') }}
        </base-checkbox>
        <div class="t-w-full t-px-2">
          <div
            v-if="$v.recaptcha.$error && !this.$v.recaptcha.required"
            class="t-mb-2 t-text-sm t-text-alert"
          >
            {{ $t('Your Google reCAPTCHA validation is invalid.') }}<br>
            {{ $t('Please try again or contact our customer-support.') }}
          </div>
          <vue-recaptcha
            ref="recaptcha"
            :sitekey="recaptchaWebsiteKey"
            :load-recaptcha-script="true"
            badge="inline"
            size="invisible"
            @verify="recaptchaVerify"
            @expired="recaptchaError"
          />
          <button-component
            :submit="true"
            type="primary"
            class="t-mb-2 t-w-full"
            data-test-id="registerSubmit"
          >
            {{ $t('Register') }} <sup class="t-ml-1">1, 2</sup>
          </button-component>
          <no-ssr>
            <facebook-login-button
              initial-text="Register with Facebook"
              class="t-mb-2 t-w-full"
            />
          </no-ssr>
          <button-component
            type="transparent"
            class="t-mb-4 t-w-full t-flex-wrap"
            @click="switchElem"
          >
            {{ $t('Already have an account?') }} <span class="t-ml-1">– {{ $t('Login to your account') }}</span>
          </button-component>
          <div class="t-w-full t-text-xs t-leading-1-rem t-text-base-lighter">
            <sup class="t-mr-1 t-font-bold">1)</sup>
            <i18n
              path="I have read and agree with the {terms}, {policy} and {return}."
              tag="span"
            >
              <template #terms>
                <router-link
                  :to="localizedRoute('/service-conditions')"
                  class="t-text-base-lighter t-underline"
                  @click.native="close()"
                  v-html="$t('Terms and Conditions')"
                />
              </template>
              <template #policy>
                <router-link
                  :to="localizedRoute('/service-imprint')"
                  class="t-text-base-lighter t-underline"
                  @click.native="close()"
                  v-html="$t('Privacy Policy')"
                />
              </template>
              <template #return>
                <router-link
                  :to="localizedRoute('/service-return')"
                  class="t-text-base-lighter t-underline"
                  @click.native="close()"
                  v-html="$t('Return Instructions')"
                />
              </template>
            </i18n>
          </div>
          <div class="t-mt-2 t-w-full t-text-xs t-leading-1-rem t-text-base-lighter">
            <sup class="t-mr-1 t-font-bold">2)</sup>
            This site is protected by reCAPTCHA and the Google
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              class="t-underline"
            >Privacy Policy</a> and
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              class="t-underline"
            >Terms of Service</a> apply.
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from 'config'
import i18n from '@vue-storefront/i18n'
import ButtonComponent from 'theme/components/core/blocks/Button'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import GenderSelect from 'theme/components/core/blocks/Form/GenderSelect'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import FacebookLoginButton from 'theme/components/core/blocks/Auth/FacebookLoginButton'
import VueRecaptcha from 'vue-recaptcha'
import NoSSR from 'vue-no-ssr'
import { toDate } from 'icmaa-config/helpers/datetime'
import { date } from 'icmaa-config/helpers/validators'
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  name: 'Register',
  components: {
    BaseInput,
    GenderSelect,
    BaseCheckbox,
    ButtonComponent,
    FacebookLoginButton,
    VueRecaptcha,
    'no-ssr': NoSSR
  },
  data () {
    return {
      email: '',
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      newsletter: false,
      password: '',
      rPassword: '',
      conditions: false,
      recaptcha: '',
      attemps: 0
    }
  },
  validations: {
    email: {
      required,
      email
    },
    firstName: {
      required
    },
    lastName: {
      required
    },
    gender: {
      required
    },
    dob: {
      required,
      date
    },
    password: {
      minLength: minLength(8),
      required
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password')
    },
    recaptcha: {
      required
    }
  },
  computed: {
    ...mapGetters({
      cluster: 'user/getCluster',
      storeConfig: 'icmaaConfig/getCurrentStoreConfig'
    }),
    dateFormat () {
      return this.storeConfig.i18n.dateFormat
    },
    recaptchaWebsiteKey () {
      return config.icmaa?.googleRecaptcha?.websiteKey || false
    }
  },
  methods: {
    switchElem () {
      this.$store.commit('ui/setAuthElem', 'login')
    },
    close () {
      this.$store.commit('ui/setAuthElem', 'login')
      this.$store.dispatch('ui/hideModal', 'modal-signup')
    },
    recaptchaVerify (token) {
      this.recaptcha = token
      return this.validate()
    },
    async recaptchaError () {
      this.recaptcha = ''
      this.$v.recaptcha.$reset()
      return this.$refs.recaptcha.reset()
    },
    async validate () {
      await this.$refs.recaptcha.execute()
      if (!this.$v.recaptcha.$error && !this.$v.recaptcha.required) {
        return
      }

      this.$v.$touch()
      if (!this.$v.$invalid) {
        return this.register()
      }
    },
    register () {
      this.$store.dispatch('ui/loader', { message: i18n.t('Registering the account ... ') })

      const formData = {
        email: this.email,
        password: this.password,
        firstname: this.firstName,
        lastname: this.lastName,
        dob: this.dob,
        gender: this.gender,
        cluster: this.cluster || null,
        newsletter: this.newsletter,
        recaptcha: this.recaptcha
      }

      if (this.dob) {
        formData.dob = toDate(this.dob, 'YYYY-MM-DD HH:mm:ss', this.dateFormat)
      }

      this.$store.dispatch('user/register', formData).then((result) => {
        Logger.debug(result, 'user')()
        this.$store.dispatch('ui/loader', false)
        if (result.code !== 200) {
          this.onFailure(result)
          // If error includes a word 'password', focus on a corresponding field
          if (result.result.includes('password')) {
            this.$refs['password'].setFocus('password')
            this.password = ''
            this.rPassword = ''
          }
        } else {
          this.$store.dispatch('user/login', { username: this.email, password: this.password })
          this.onSuccess()
          this.close()
        }
      }).catch(err => {
        this.attemps++
        let message = 'There was an unexpected error. Please check your entered data and try again.'
        if (this.attemps >= 3) {
          message = 'We are sorry you failed multiple times. You can contact our support for help.'
        }

        this.onFailure({ result: message })
        this.$store.dispatch('ui/loader', false)
        Logger.error(err, 'user')()
      })
    },
    onSuccess () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: this.$t('Awesome! You have been successfully registered and logged in now!'),
        action1: { label: this.$t('OK') }
      })
    },
    onFailure (result) {
      this.recaptchaError()
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(result.result),
        action1: { label: this.$t('OK') }
      })
    }
  }
}
</script>

<style lang="scss">

.grecaptcha-badge {
    visibility: hidden;
    display: none;
}

</style>
