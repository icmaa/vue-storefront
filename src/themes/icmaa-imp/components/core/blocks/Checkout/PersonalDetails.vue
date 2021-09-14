<template>
  <div class="personal-details">
    <form v-if="active">
      <div class="t-flex t-flex-wrap t--mx-2">
        <div v-if="!isLoggedIn" class="t-w-full t-px-2 t-mb-6">
          <button-component
            size="lg"
            class="t-w-full lg:t-w-auto"
            @click="openLoginModal"
          >
            {{ $t('Login to your account') }}
          </button-component>
        </div>
        <div v-if="!isLoggedIn" class="t-w-full t-px-2 t-mb-4 t-font-light">
          {{ $t('Proceed as new user') }}
        </div>
        <base-input
          class="t-w-full t-px-2 t-mb-4"
          type="email"
          autocomplete="email"
          id="email"
          name="email"
          :placeholder="$t('Email address')"
          v-model="details.email"
          :disabled="isLoggedIn"
          :validations="[
            {
              condition: $v.details.email.$error && !$v.details.email.required,
              text: $t('Field is required')
            },
            {
              condition: $v.details.email.$error && !$v.details.email.email,
              text: $t('Please provide valid e-mail address.')
            }
          ]"
        />
        <base-input
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
          type="text"
          autocomplete="given-name"
          id="first-name"
          name="first-name"
          :placeholder="$t('First name')"
          v-model.trim="details.firstname"
          :validations="[
            {
              condition: $v.details.firstname.$error && !$v.details.firstname.required,
              text: $t('Field is required')
            },
            {
              condition: $v.details.firstname.$error && !$v.details.firstname.latin,
              text: $t('Invalid characters')
            }
          ]"
        />
        <base-input
          class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
          type="text"
          autocomplete="family-name"
          id="last-name"
          name="last-name"
          :placeholder="$t('Last name')"
          v-model.trim="details.lastname"
          :validations="[
            {
              condition: $v.details.lastname.$error && !$v.details.lastname.required,
              text: $t('Field is required')
            },
            {
              condition: $v.details.lastname.$error && !$v.details.lastname.latin,
              text: $t('Invalid characters')
            }
          ]"
        />
        <base-checkbox
          v-if="!isLoggedIn"
          class="t-w-full t-px-2 t-mb-4"
          id="create-account"
          name="create-account"
          v-model="details.createAccount"
          data-test-id="CreateAccountCheckbox"
        >
          {{ $t('I want to create an account') }}
        </base-checkbox>
        <template v-if="details.createAccount">
          <gender-select
            class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
            id="gender"
            name="gender"
            v-model="details.gender"
            :validations="[{
              condition: !$v.details.gender.required && $v.details.gender.$error,
              text: $t('Field is required')
            }]"
          />
          <base-input
            class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
            id="dob"
            name="dob"
            autocomplete="bday"
            mask="date"
            :placeholder="`${$t('Date of birth')} (${dateFormat})`"
            v-model="details.dob"
            :validations="[{
              condition: !$v.details.dob.required && $v.details.dob.$error,
              text: $t('Field is required')
            }, {
              condition: !$v.details.dob.date && $v.details.dob.$error,
              text: $t('Use a valid date.')
            }]"
          />
          <base-input
            class="t-w-full t-px-2 t-mb-4"
            type="password"
            autocomplete="new-password"
            ref="password"
            id="password"
            name="password"
            :placeholder="$t('Password')"
            v-model="details.password"
            :validations="[
              {
                condition: $v.details.password.$error && !$v.details.password.required,
                text: $t('Field is required')
              },{
                condition: $v.details.password.$error && !$v.details.password.minLength,
                text: $t('Password must have at least 8 letters.')
              }
            ]"
          />
          <base-input
            class="t-w-full t-px-2 t-mb-4"
            type="password"
            autocomplete="new-password"
            id="password-confirm"
            name="password-confirm"
            :placeholder="$t('Repeat password')"
            v-model="rPassword"
            :validations="[
              {
                condition: $v.rPassword.$error && !$v.rPassword.required,
                text: $t('Field is required')
              },
              {
                condition: $v.rPassword.$error && !$v.rPassword.sameAsPassword,
                text: $t('Passwords must be identical.')
              }
            ]"
          />
        </template>
        <div class="t-w-full t-px-2">
          <button-component
            class="t-w-full lg:t-w-auto"
            type="primary"
            @click.native.stop="submit"
            data-test-id="NextStepButton"
          >
            {{ $t(('Continue to address')) }}
          </button-component>
        </div>
      </div>
    </form>
    <div v-if="!active && done">
      <div class="t-text-sm">
        {{ details.firstname }} {{ details.lastname }}<br>
        {{ details.email }}
      </div>
      <div v-if="details.createAccount && !isLoggedIn" class="t-mt-2">
        <base-checkbox
          id="create-account-info-box"
          name="create-account-info-box"
          v-model="details.createAccount"
          disabled
        >
          {{ $t('Create a new account') }}
        </base-checkbox>
      </div>
    </div>
  </div>
</template>

<script>

import PersonalDetails from 'icmaa-checkout/components/PersonalDetails'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import GenderSelect from 'theme/components/core/blocks/Form/GenderSelect'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'PersonalDetails',
  components: {
    ButtonComponent,
    BaseCheckbox,
    BaseInput,
    GenderSelect
  },
  mixins: [ PersonalDetails ]
}
</script>
