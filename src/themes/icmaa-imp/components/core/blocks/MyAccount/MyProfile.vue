<template>
  <div class="t-bg-white t-p-4">
    <Headline>
      {{ $t('My profile') }}
    </Headline>
    <form
      novalidate
      class="t--mx-2 t-flex t-flex-wrap"
      @submit.prevent="submit"
    >
      <BaseInput
        id="email"
        v-model="profile.email"
        type="email"
        name="email"
        autocomplete="email"
        focus
        :label="$t('E-mail address') + ' *'"
        :validations="[
          {
            condition: !validation.email.required && validation.email.$error,
            text: $t('Field is required')
          },
          {
            condition: !validation.email.email && validation.email.$error,
            text: $t('Please provide valid e-mail address.')
          }
        ]"
        class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
        :disabled="true"
      />
      <BaseInput
        id="first-name"
        v-model="profile.firstname"
        name="first-name"
        autocomplete="given-name"
        :label="$t('First name') + ' *'"
        :validations="[
          {
            condition: !validation.firstname.required && validation.firstname.$error,
            text: $t('Field is required')
          }
        ]"
        class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
      />
      <BaseInput
        id="last-name"
        v-model="profile.lastname"
        name="last-name"
        autocomplete="family-name"
        :label="$t('Last name') + ' *'"
        :validations="[{
          condition: !validation.lastname.required && validation.lastname.$error,
          text: $t('Field is required')
        }]"
        class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
      />
      <GenderSelect
        id="gender"
        v-model="profile.gender"
        name="gender"
        :label="$t('Gender') + ' *'"
        :validations="[{
          condition: !validation.gender.required && validation.gender.$error,
          text: $t('Field is required')
        }]"
        class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
      />
      <BaseInput
        id="dob"
        v-model="profile.dob"
        name="dob"
        autocomplete="bday"
        mask="date"
        :label="$t('Date of birth') + ' *'"
        :placeholder="dateFormat"
        :validations="[
          {
            condition: !validation.dob.required && validation.dob.$error,
            text: $t('Field is required')
          },
          {
            condition: !validation.dob.date && validation.dob.$error,
            text: $t('Use a valid date.')
          }
        ]"
        class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
      />
      <BaseCheckbox
        id="changePassword"
        v-model="profile.changePassword"
        name="changePassword"
        class="t-mb-4 t-w-full t-px-2"
      >
        {{ $t('Change my password') }}
      </BaseCheckbox>
      <div
        v-if="profile.changePassword"
        class="t-flex t-grow t-flex-wrap"
      >
        <BaseInput
          id="oldPassword"
          ref="oldPassword"
          v-model="profile.oldPassword"
          type="password"
          name="oldPassword"
          autocomplete="old-password"
          :label="$t('Current password') + ' *'"
          :validations="[
            {
              condition: !validation.oldPassword.required && validation.oldPassword.$error,
              text: $t('Field is required')
            },
            {
              condition: !validation.oldPassword.minLength && validation.oldPassword.$error,
              text: $t('Password must have at least 8 letters.')
            }
          ]"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
        />
        <div class="t-w-full" />
        <BaseInput
          id="password"
          ref="password"
          v-model="profile.password"
          type="password"
          name="password"
          autocomplete="new-password"
          :label="$t('Password') + ' *'"
          :validations="[
            {
              condition: !validation.password.required && validation.password.$error,
              text: $t('Field is required')
            },
            {
              condition: !validation.password.minLength && validation.password.$error,
              text: $t('Password must have at least 8 letters.')
            }
          ]"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
        />
        <BaseInput
          id="rPassword"
          v-model="profile.rPassword"
          type="password"
          name="rPassword"
          autocomplete="new-password"
          :label="$t('Repeat password') + ' *'"
          :validations="[
            {
              condition: !validation.rPassword.required && validation.rPassword.$error,
              text: $t('Field is required')
            },
            {
              condition: !validation.rPassword.sameAsPassword && validation.rPassword.$error,
              text: $t('Passwords must be identical.')
            }
          ]"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
        />
      </div>
      <div class="t-w-full t-px-2">
        <ButtonComponent
          :submit="true"
          type="primary"
          class="t-w-full lg:t-w-auto"
        >
          {{ $t('Update my profile') }}
        </ButtonComponent>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from 'config'

import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import pick from 'lodash-es/pick'
import invert from 'lodash-es/invert'

import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { unicodeAlpha } from '@vue-storefront/core/helpers/validators'
import { date } from 'icmaa-config/helpers/validators'
import { toDate } from 'icmaa-config/helpers/datetime'

import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import GenderSelect from 'theme/components/core/blocks/Form/GenderSelect'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'MyProfile',
  components: {
    Headline,
    BaseCheckbox,
    GenderSelect,
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
    dateFormat () {
      return currentStoreView().i18n.dateFormat
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
  methods: {
    submit () {
      this.validation.$touch()
      if (!this.validation.$invalid) {
        let profile = this.profile
        if (profile.gender) {
          const gender = config.icmaa.user.genderMap[profile.gender]
          profile = Object.assign({}, profile, { gender })
        }
        if (profile.dob) {
          profile.dob = toDate(profile.dob, 'YYYY-MM-DD HH:mm:ss', this.dateFormat)
        }

        let customer = Object.assign({}, this.customer, profile)

        let newPassword = false
        if (this.profile.changePassword) {
          newPassword = {
            currentPassword: this.profile.oldPassword,
            newPassword: this.profile.password
          }
        }

        this.$bus.$emit('myAccount-before-updateUser', customer, newPassword)
      }

      return false
    },
    initCustomer () {
      if (this.customer) {
        const keys = Object.keys(this.profile)
        this.profile = Object.assign({}, this.profile, pick(this.customer, keys))

        if (this.profile.dob) {
          this.profile.dob = toDate(this.profile.dob, currentStoreView().i18n.dateFormat, 'YYYY-MM-DD HH:mm:ss')
        }

        if (this.profile.gender) {
          this.profile.gender = invert(config.icmaa.user.genderMap)[this.profile.gender.toString()]
        }
      }
    }
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
