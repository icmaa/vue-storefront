<template>
  <div class="personal-details">
    <form v-if="isActive">
      <div class="t-flex t-flex-wrap t--mx-2">
        <div v-if="!isLoggedIn" class="t-w-full t-px-2 t-mb-6">
          <button-component
            type="primary"
            data-test-id="loginToYourAccount"
            @click="openLoginModal"
            class="t-w-full lg:t-w-auto"
          >
            {{ $t('Login to your account') }}
          </button-component>
        </div>
        <div v-if="!isLoggedIn" class="t-w-full t-px-2 t-mb-6 t-font-light">
          {{ $t('Proceed as new user') }}
        </div>
        <base-input
          class="t-w-full t-px-2 t-mb-4"
          type="email"
          autocomplete="email"
          id="email"
          name="email"
          :placeholder="$t('Email address')"
          v-model="details.emailAddress"
          :disabled="isLoggedIn"
          :validations="[
            {
              condition: $v.details.emailAddress.$error && !$v.details.emailAddress.required,
              text: $t('Field is required')
            },
            {
              condition: $v.details.emailAddress.$error && !$v.details.emailAddress.email,
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
          v-model.trim="details.firstName"
          :validations="[
            {
              condition: $v.details.firstName.$error && !$v.details.firstName.required,
              text: $t('Field is required')
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
          v-model.trim="details.lastName"
          :validations="[{
            condition: $v.details.lastName.$error && !$v.details.lastName.required,
            text: $t('Field is required')
          }]"
        />
        <base-checkbox
          v-if="!isLoggedIn"
          class="t-w-full t-px-2 t-mb-4"
          id="create-account"
          name="create-account"
          v-model="details.createAccount"
        >
          {{ $t('I want to create an account') }}
        </base-checkbox>
        <template v-if="details.createAccount">
          <base-input
            class="t-w-full t-px-2 t-mb-4"
            type="password"
            autocomplete="new-password"
            ref="password"
            id="password"
            name="password"
            :placeholder="$t('Password')"
            v-model="details.password"
            :validations="[{
              condition: $v.details.password.$error && !$v.details.password.required,
              text: $t('Field is required.')
            },{
              condition: $v.details.password.$error && !$v.details.password.minLength,
              text: $t('Password must have at least 8 letters.')
            }]"
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
                text: $t('Field is required.')
              },
              {
                condition: $v.rPassword.$error && !$v.rPassword.sameAsPassword,
                text: $t('Passwords must be identical.')
              }
            ]"
          />
        </template>
        <div class="t-w-full t-px-2 t-flex t-flex-wrap t-items-baseline">
          <button-component
            class="t-w-full t-mb-2 lg:t-w-auto lg:t-mb-0 lg:t-mr-2"
            type="primary"
            @click.native.stop="submit"
            data-test-id="personalDetailsSubmit"
          >
            {{ $t((isVirtualCart ? 'Continue to payment' : 'Continue to shipping')) }}
          </button-component>
        </div>
      </div>
    </form>
    <div class="" v-if="!isActive && isFilled">
      <div class="t-text-sm">
        {{ details.firstName }} {{ details.lastName }}<br>
        {{ details.emailAddress }}
      </div>
      <div v-if="details.createAccount && !isLoggedIn" class="t-mt-2">
        <base-checkbox
          class="mt25"
          id="createAccountCheckboxInfo"
          name="createAccountCheckboxInfo"
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
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'PersonalDetails',
  components: {
    ButtonComponent,
    BaseCheckbox,
    BaseInput
  },
  mixins: [ PersonalDetails ]
}
</script>
