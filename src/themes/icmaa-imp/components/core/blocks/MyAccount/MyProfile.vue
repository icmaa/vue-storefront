<template>
  <div class="">
    <h1>{{ $t('My profile') }}</h1>
    <form @submit.prevent="submit" novalidate>
      <base-input
        type="email"
        name="email"
        autocomplete="email"
        v-model="profile.email"
        focus
        :placeholder="$t('E-mail address') + ' *'"
        :validations="[
          {
            condition: !validation.email.required && validation.email.$error,
            text: $t('Field is required.')
          },
          {
            condition: !validation.email.email && validation.email.$error,
            text: $t('Please provide valid e-mail address.')
          }
        ]"
      />
      <base-input
        name="first-name"
        autocomplete="given-name"
        v-model="profile.firstname"
        :placeholder="$t('First name') + ' *'"
        :validations="[
          {
            condition: !validation.firstname.required && validation.firstname.$error,
            text: $t('Field is required.')
          }
        ]"
      />
      <base-input
        name="last-name"
        autocomplete="family-name"
        v-model="profile.lastname"
        :placeholder="$t('Last name') + ' *'"
        :validations="[{
          condition: !validation.lastname.required && validation.lastname.$error,
          text: $t('Field is required.')
        }]"
      />
      <base-select
        name="gender"
        v-model="profile.gender"
        :options="genderOptions"
        :initial-option-text="$t('Gender') + ' *'"
        :validations="[{
          condition: !validation.gender.required && validation.gender.$error,
          text: $t('Field is required.')
        }]"
      />
      <base-input
        name="dob"
        autocomplete="bday"
        mask="date"
        v-model="profile.dob"
        :placeholder="$t('Date of birth') + ' (DD.MM.YYYY) *'"
        :validations="[
          {
            condition: !validation.dob.required && validation.dob.$error,
            text: $t('Field is required.')
          },
          {
            condition: !validation.dob.date && validation.dob.$error,
            text: $t('Use a valid date.')
          }
        ]"
      />
      <base-checkbox
        name="changePassword"
        id="changePassword"
        v-model="profile.changePassword"
      >
        {{ $t('Change my password') }}
      </base-checkbox>
      <div v-if="profile.changePassword">
        <base-input
          type="password"
          name="oldPassword"
          ref="oldPassword"
          autocomplete="old-password"
          v-model="profile.oldPassword"
          :placeholder="$t('Current password') + ' *'"
          :validations="[
            {
              condition: !validation.oldPassword.required && validation.oldPassword.$error,
              text: $t('Field is required.')
            },
            {
              condition: !validation.oldPassword.minLength && validation.oldPassword.$error,
              text: $t('Password must have at least 8 letters.')
            }
          ]"
        />
        <base-input
          type="password"
          name="password"
          ref="password"
          autocomplete="new-password"
          v-model="profile.password"
          :placeholder="$t('Password') + ' *'"
          :validations="[
            {
              condition: !validation.password.required && validation.password.$error,
              text: $t('Field is required.')
            },
            {
              condition: !validation.password.minLength && validation.password.$error,
              text: $t('Password must have at least 8 letters.')
            }
          ]"
        />
        <base-input
          type="password"
          name="rPassword"
          autocomplete="new-password"
          v-model="profile.rPassword"
          :placeholder="$t('Repeat password') + ' *'"
          :validations="[
            {
              condition: !validation.rPassword.required && validation.rPassword.$error,
              text: $t('Field is required.')
            },
            {
              condition: !validation.rPassword.sameAsPassword && validation.rPassword.$error,
              text: $t('Passwords must be identical.')
            }
          ]"
        />
      </div>

      <button-component :submit="true" type="primary">
        {{ $t('Update my profile') }}
      </button-component>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from 'config'
import i18n from '@vue-storefront/i18n'

import pick from 'lodash-es/pick'
import invert from 'lodash-es/invert'

import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { unicodeAlpha, unicodeAlphaNum } from '@vue-storefront/core/helpers/validators'
import { date } from 'icmaa-config/helpers/validators'
import { toDate } from 'icmaa-config/helpers/datetime'

import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'MyProfile',
  components: {
    BaseCheckbox,
    BaseSelect,
    BaseInput,
    ButtonComponent
  },
  data () {
    return {
      profile: {
        email: '',
        firstname: '',
        lastname: '',
        gender: '',
        dob: '',
        changePassword: false,
        oldPassword: '',
        password: '',
        rPassword: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport',
      customer: 'user/getCustomer'
    }),
    validation () {
      return this.$v.profile
    },
    genderOptions () {
      return [
        { label: i18n.t('Male'), value: 'male' },
        { label: i18n.t('Female'), value: 'female' }
      ]
    }
  },
  methods: {
    submit () {
      this.validation.$touch()
      if (!this.validation.$invalid) {
        let customer = Object.assign({}, this.customer, this.profile)
        this.$bus.$emit('myAccount-before-updateUser', customer)

        if (this.profile.changePassword) {
          this.$bus.$emit('myAccount-before-changePassword', {
            currentPassword: this.profile.oldPassword,
            newPassword: this.profile.password
          })
        }
      }

      return false
    },
    initCustomer () {
      if (this.customer) {
        const keys = Object.keys(this.profile)
        this.profile = Object.assign({}, this.profile, pick(this.customer, keys))

        if (this.profile.dob) {
          this.profile.dob = toDate(this.profile.dob, undefined, 'YYYY-MM-DD HH:mm:ss')
        }

        if (this.profile.gender) {
          this.profile.gender = invert(config.icmaa.user.gender_map)[this.profile.gender.toString()]
        }
      }
    }
  },
  mounted () {
    this.initCustomer()
  },
  beforeMount () {
    this.$bus.$on('user-after-loggedin', this.initCustomer)
  },
  beforeDestroy () {
    this.$bus.$off('user-after-loggedin', this.initCustomer)
  },
  validations () {
    const password = this.profile.changePassword ? {
      oldPassword: {
        required
      },
      password: {
        required
      },
      rPassword: {
        required,
        sameAsPassword: sameAs('password')
      }
    } : {}

    return {
      profile: {
        firstname: {
          required,
          minLength: minLength(2),
          unicodeAlpha
        },
        lastname: {
          required,
          unicodeAlpha
        },
        email: {
          required,
          email
        },
        dob: {
          required,
          date
        },
        gender: {
          required
        },
        ...password
      }
    }
  }
}
</script>
