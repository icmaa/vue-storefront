<template>
  <div class="personal-details">
    <form v-if="isActive">
      <div class="t-flex t-flex-wrap t--mx-2">
        <base-input
          class="t-w-full t-px-2 t-mb-4"
          type="email"
          autocomplete="email"
          id="email"
          name="email"
          :placeholder="$t('Email address')"
          v-model="personalDetails.email"
          :validations="[
            {
              condition: $v.personalDetails.email.$error && !$v.personalDetails.email.required,
              text: $t('Field is required')
            },
            {
              condition: $v.personalDetails.email.$error && !$v.personalDetails.email.email,
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
            class="t-w-full t-px-2 t-mb-4"
            type="password"
            autocomplete="new-password"
            ref="password"
            id="password"
            name="password"
            :placeholder="$t('Password')"
            v-model="personalDetails.password"
            :validations="[{
              condition: $v.personalDetails.password.$error && !$v.personalDetails.password.required,
              text: $t('Field is required.')
            },{
              condition: $v.personalDetails.password.$error && !$v.personalDetails.password.minLength,
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
    </form>
    <div class="" v-if="!isActive && isFilled">
      <div>
        {{ personalDetails.firstName }} {{ personalDetails.lastName }}<br>
        {{ personalDetails.email }}
      </div>
      <div v-if="personalDetails.createAccount && !currentUser" class="t-mt-4">
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
  validations () {
    const val = {
      personalDetails: {
        email: {
          required,
          email
        },
        firstName: {
          required
        },
        lastName: {
          required
        }
      }
    }

    if (this.personalDetails.createAccount) {
      val.personalDetails.password = {
        minLength: minLength(8),
        required
      }
      val.rPassword = {
        sameAsPassword: sameAs(function () { return this.personalDetails.password }),
        required
      }
    }

    return val
  }
}
</script>
