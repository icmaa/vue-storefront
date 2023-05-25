<template>
  <div class="personal-details">
    <form v-if="active">
      <div
        v-if="!isLoggedIn"
        class="t-mb-8 t-flex"
      >
        <Login
          v-if="!showRegistration"
          :is-modal="false"
          class="t-w-full"
          @call-register="toggleRegistration(true)"
        />
        <ButtonComponent
          v-else
          size="lg"
          class="t-w-full lg:t-w-auto"
          @click="toggleRegistration(true)"
        >
          {{ $t('Login') }}
        </ButtonComponent>
      </div>
      <div v-if="!isLoggedIn">
        <div class="t-mb-4 t-font-light">
          {{ details.createAccount ? $t('Proceed as new user') : $t('Proceed without login') }}
        </div>
        <div
          v-if="!showRegistration"
          class="t-flex t-flex-wrap"
        >
          <div class="t-w-full">
            <ButtonComponent
              type="ghost"
              class="t-w-full"
              data-test-id="guestCheckoutButton"
              @click="toggleRegistration(false)"
            >
              {{ $t('Proceed as guest') }}
            </ButtonComponent>
          </div>
          <PaypalCheckoutButton
            color="white"
            class="t-z-0 t-mt-2 t-flex-1"
          />
        </div>
      </div>
      <div
        v-if="isLoggedIn || (!isLoggedIn && showRegistration)"
        class="t--mx-2 t-flex t-flex-wrap"
        data-test-id="RegistrationForm"
      >
        <BaseInput
          id="email"
          v-model="details.email"
          class="t-mb-4 t-w-full t-px-2"
          type="email"
          autocomplete="email"
          name="email"
          :placeholder="$t('Email address')"
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
        <BaseInput
          id="first-name"
          v-model.trim="details.firstname"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
          type="text"
          autocomplete="given-name"
          name="first-name"
          :placeholder="$t('First name')"
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
        <BaseInput
          id="last-name"
          v-model.trim="details.lastname"
          class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
          type="text"
          autocomplete="family-name"
          name="last-name"
          :placeholder="$t('Last name')"
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
        <BaseCheckbox
          v-if="!isLoggedIn"
          id="create-account"
          v-model="details.createAccount"
          class="t-mb-4 t-w-full t-px-2"
          name="create-account"
          data-test-id="CreateAccountCheckbox"
        >
          {{ $t('I want to create an account') }}
        </BaseCheckbox>
        <template v-if="details.createAccount">
          <GenderSelect
            id="gender"
            v-model="details.gender"
            class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
            name="gender"
            :validations="[{
              condition: !$v.details.gender.required && $v.details.gender.$error,
              text: $t('Field is required')
            }]"
          />
          <BaseInput
            id="dob"
            v-model="details.dob"
            class="t-mb-4 t-w-full t-px-2 lg:t-w-1/2"
            name="dob"
            autocomplete="bday"
            mask="date"
            :placeholder="`${$t('Date of birth')} (${dateFormat})`"
            :validations="[{
              condition: !$v.details.dob.required && $v.details.dob.$error,
              text: $t('Field is required')
            }, {
              condition: !$v.details.dob.date && $v.details.dob.$error,
              text: $t('Use a valid date.')
            }]"
          />
          <BaseInput
            id="password"
            ref="password"
            v-model="details.password"
            class="t-mb-4 t-w-full t-px-2"
            type="password"
            autocomplete="new-password"
            name="password"
            :placeholder="$t('Password')"
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
          <BaseInput
            id="password-confirm"
            v-model="rPassword"
            class="t-mb-4 t-w-full t-px-2"
            type="password"
            autocomplete="new-password"
            name="password-confirm"
            :placeholder="$t('Repeat password')"
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
          <ButtonComponent
            class="t-w-full lg:t-w-auto"
            type="primary"
            data-test-id="NextStepButton"
            @click.native.stop="submit"
          >
            {{ $t(('Continue to address')) }}
          </ButtonComponent>
        </div>
      </div>
    </form>
    <div v-if="!active && done">
      <div class="t-text-sm">
        {{ details.firstname }} {{ details.lastname }}<br>
        {{ details.email }}
      </div>
      <div
        v-if="details.createAccount && !isLoggedIn"
        class="t-mt-2"
      >
        <BaseCheckbox
          id="create-account-info-box"
          v-model="details.createAccount"
          name="create-account-info-box"
          disabled
        >
          {{ $t('Create a new account') }}
        </BaseCheckbox>
      </div>
    </div>
  </div>
</template>

<script>

import PersonalDetails from 'icmaa-checkout/components/PersonalDetails'
import Login from 'theme/components/core/blocks/Auth/Login'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import GenderSelect from 'theme/components/core/blocks/Form/GenderSelect'
import ButtonComponent from 'theme/components/core/blocks/Button'
import PaypalCheckoutButton from 'icmaa-paypal/components/Checkout/ButtonWrapper'

export default {
  name: 'PersonalDetails',
  components: {
    Login,
    ButtonComponent,
    BaseCheckbox,
    BaseInput,
    GenderSelect,
    PaypalCheckoutButton
  },
  mixins: [ PersonalDetails ]
}
</script>
