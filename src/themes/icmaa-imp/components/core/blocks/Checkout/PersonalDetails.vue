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
            :label="$t('Email address')"
            :placeholder="$t('Email address')"
            v-model="personalDetails.emailAddress"
            :validations="[
              {
                condition: $v.personalDetails.emailAddress.$error && !$v.personalDetails.emailAddress.required,
                text: $t('Field is required')
              },
              {
                condition: !$v.personalDetails.emailAddress.email && $v.personalDetails.emailAddress.$error,
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
            :label="$t('First name')"
            :placeholder="$t('First name')"
            v-model.trim="personalDetails.firstName"
            :validations="[
              {
                condition: $v.personalDetails.firstName.$error && !$v.personalDetails.firstName.required,
                text: $t('Field is required')
              },
              {
                condition: !$v.personalDetails.firstName.minLength,
                text: $t('Name must have at least 2 letters.')
              }
            ]"
          />
          <base-input
            class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
            type="text"
            autocomplete="family-name"
            id="last-name"
            name="last-name"
            :label="$t('Last name')"
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
            id="createAccountCheckbox"
            name="createAccountCheckbox"
            v-model="createAccount"
          >
            {{ $t('I want to create an account') }}
          </base-checkbox>
          <template v-if="createAccount && !currentUser">
            <base-input
              class="t-w-full lg:t-w-1/2 t-px-2 t-mb-4"
              type="password"
              autocomplete="new-password"
              ref="password"
              id="password"
              name="password"
              :label="$t('Password')"
              :placeholder="$t('Password')"
              v-model="password"
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
              :label="$t('Repeat password')"
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
        </div>
      </div>
      <div class="col-xs-11 col-sm-9 col-md-10">
        <div class="row my30">
          <div class="col-xs-12 col-md-7 px20 button-container">
            <button-component
              data-test-id="personalDetailsSubmit"
              @click.native.stop="sendDataToCheckout"
              :disabled="createAccount ? $v.$invalid : $v.personalDetails.$invalid"
            >
              {{ $t((isVirtualCart ? 'Continue to payment' : 'Continue to shipping')) }}
            </button-component>
          </div>
          <div
            class="col-xs-12 col-md-5 center-xs end-md"
            v-if="!currentUser"
          >
            <p class="h4 cl-accent">
              {{ $t('or') }}
              <span
                class="link pointer"
                @click="gotoAccount"
              >
                {{ $t('login to your account') }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="" v-if="!isActive && isFilled">
      <div>
        {{ personalDetails.firstName }} {{ personalDetails.lastName }}<br>
        {{ personalDetails.emailAddress }}
      </div>
      <div v-if="createAccount && !currentUser">
        <base-checkbox
          class="mt25"
          id="createAccountCheckboxInfo"
          name="createAccountCheckboxInfo"
          v-model="createAccount"
          disabled
        >
          {{ $t('Create a new account') }}
        </base-checkbox>
        <p class="h5 cl-tertiary">
          {{ $t('The new account will be created with the purchase. You will receive details on e-mail.') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

import PersonalDetails from 'icmaa-checkout/components/PersonalDetails'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonComponent from 'theme/components/core/blocks/Button'
import Tooltip from 'theme/components/core/Tooltip'

export default {
  components: {
    ButtonComponent,
    Tooltip,
    BaseCheckbox,
    BaseInput
  },
  mixins: [PersonalDetails],
  validations: {
    personalDetails: {
      firstName: {
        required,
        minLength: minLength(2)
      },
      lastName: {
        required
      },
      emailAddress: {
        required,
        email
      }
    },
    password: {
      required
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password')
    },
    acceptConditions: {
      required
    }
  }
}
</script>
