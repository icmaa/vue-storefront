<template>
  <div class="personal-details">
    <div class="" v-if="isActive">
      <div class="">
        <div class="t-flex t-flex-wrap t--mx-2">
          <base-input
            class="t-w-full t-px-2 t-mb-4"
            type="email"
            autocomplete="email"
            id="email-address"
            name="email-address"
            :placeholder="$t('Email address')"
            v-model="personalDetails.emailAddress"
            :validations="[
              {
                condition: $v.personalDetails.emailAddress.$error && !$v.personalDetails.emailAddress.required,
                text: $t('Field is required')
              },
              {
                condition: $v.personalDetails.emailAddress.$error && !$v.personalDetails.emailAddress.email,
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
            v-model.trim="personalDetails.firstName"
            :validations="[
              {
                condition: $v.personalDetails.firstName.$error && !$v.personalDetails.firstName.required,
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
            v-model.trim="personalDetails.lastName"
            :validations="[{
              condition: $v.personalDetails.lastName.$error && !$v.personalDetails.lastName.required,
              text: $t('Field is required')
            }]"
          />
          <base-checkbox
            v-if="!currentUser"
            class="t-w-full t-px-2 t-mb-4"
            id="create-account"
            name="create-account"
            v-model="personalDetails.createAccount"
          >
            {{ $t('I want to create an account') }}
          </base-checkbox>
          <template v-if="personalDetails.createAccount && !currentUser">
            <base-input
              class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
              type="password"
              autocomplete="new-password"
              ref="password"
              id="password"
              name="password"
              :placeholder="$t('Password')"
              v-model="personalDetails.password"
              :validations="[{
                condition: $v.password.$error && !$v.password.required,
                text: $t('Field is required.')
              }]"
            />
            <base-input
              class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
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
                  condition:!$v.rPassword.sameAsPassword,
                  text: $t('Passwords must be identical.')
                }
              ]"
            />
          </template>
          <div class="t-flex t-flex-wrap">
            <button-component
              data-test-id="personalDetailsSubmit"
              class="t-w-full lg:t-w-auto"
              @click.native.stop="submit"
            >
              {{ $t((isVirtualCart ? 'Continue to payment' : 'Continue to shipping')) }}
            </button-component>
            <button-component
              v-if="!currentUser"
              data-test-id="loginToYourAccount"
              @click="openLoginModal"
              class="t-w-full lg:t-w-auto"
            >
              {{ $t('Login to your account') }}
            </button-component>
          </div>
        </div>
      </div>
    </div>
    <div class="" v-if="!isActive && isFilled">
      <div>
        {{ personalDetails.firstName }} {{ personalDetails.lastName }}<br>
        {{ personalDetails.emailAddress }}
      </div>
      <div v-if="personalDetails.createAccount && !currentUser">
        <base-checkbox
          class="mt25"
          id="createAccountCheckboxInfo"
          name="createAccountCheckboxInfo"
          v-model="personalDetails.createAccount"
          disabled
        >
          {{ $t('Create a new account') }}
        </base-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

import PersonalDetails from 'icmaa-checkout/components/PersonalDetails'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    ButtonComponent,
    BaseCheckbox,
    BaseInput
  },
  mixins: [ PersonalDetails ],
  validations: {
    personalDetails: {
      emailAddress: {
        required,
        email
      },
      firstName: {
        required
      },
      lastName: {
        required
      }
    },
    password: {
      minLength: minLength(8),
      required
    },
    rPassword: {
      sameAsPassword: sameAs(function () { return this.personalDetails.password }),
      required
    }
  }
}
</script>
