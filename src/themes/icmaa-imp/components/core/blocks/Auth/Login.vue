<template>
  <form class="" @submit.prevent="login" novalidate>
    <no-ssr>
      <v-facebook-login app-id="103608836440301" :login-options="{ scope: 'email', return_scopes: true }" @sdk-init="fbSdkInit" @login="fbLogin" @connect="fbConnect" />
    </no-ssr>
    <div v-if="hasRedirect" class="t-mb-4 t-text-sm">
      {{ $t('You need to be logged in to see this page') }}
    </div>
    <base-input
      class="t-mb-4" type="email" name="email" id="email" v-model="email"
      :placeholder="$t('E-mail address *')"
      :validations="[
        {
          condition: !$v.email.required && $v.email.$error,
          text: $t('Field is required.')
        },
        {
          condition: !$v.email.email && $v.email.$error,
          text: $t('Please provide valid e-mail address.')
        }
      ]"
    />
    <base-input
      class="t-mb-4"
      type="password"
      name="password"
      id="password"
      v-model="password"
      :placeholder="$t('Password *')"
      :validations="[
        {
          condition: !$v.password.required && $v.password.$error,
          text: $t('Field is required.')
        }
      ]"
    />
    <div class="t-flex t-items-center t-justify-between t-mb-4">
      <base-checkbox class="t-mr-4" id="remember" v-model="remember">
        {{ $t('Remember me') }}
      </base-checkbox>
      <div href="#" @click.prevent="remindPassword" class="t-text-sm t-cursor-pointer">
        {{ $t('Forgot the password?') }}
      </div>
    </div>
    <button-component :submit="true" type="primary" class="t-w-full t-mb-2" data-testid="loginSubmit">
      {{ $t('Login to your account') }}
    </button-component>
    <button-component type="facebook" icon="facebook" icon-set="icmaa" icon-position="left" class="t-w-full t-mb-2">
      {{ $t('Login with Facebook') }}
    </button-component>
    <button-component type="transparent" class="t-w-full t--mb-2" @click="switchElem" data-testid="registerLink">
      {{ $t('Not yet an account?') }} <span class="t-ml-1">{{ $t('Register now') }}</span>
    </button-component>
  </form>
</template>

<script>

import { required, email } from 'vuelidate/lib/validators'
import { Login } from '@vue-storefront/core/modules/user/components/Login'

import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonComponent from 'theme/components/core/blocks/Button'

import NoSSR from 'vue-no-ssr'
const VFacebookLogin = () => import(/* webpackChunkName: "vsf-layout-fblogin" */ 'vue-facebook-login-component')

export default {
  components: {
    BaseCheckbox,
    BaseInput,
    ButtonComponent,
    VFacebookLogin,
    'no-ssr': NoSSR
  },
  mixins: [ Login ],
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  data () {
    return {
      hasRedirect: !!localStorage.getItem('redirect')
    }
  },
  methods: {
    login () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t('Please fix the validation errors'),
          action1: { label: this.$t('OK') }
        })
        return
      }
      this.callLogin()
    },
    remindPassword () {
      if (!(typeof navigator !== 'undefined' && navigator.onLine)) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t('Reset password feature does not work while offline!'),
          action1: { label: this.$t('OK') }
        })
      } else {
        this.callForgotPassword()
      }
    },
    onSuccess () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: this.$t('You are logged in!'),
        action1: { label: this.$t('OK') }
      })
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(result.result),
        action1: { label: this.$t('OK') }
      })
    },
    fbSdkInit (response) {
      console.log(response)
    },
    fbLogin (response, test) {
      console.log(response, test)
    },
    fbConnect (response) {
      console.log(response)
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: this.$t('You are logged in!'),
        action1: { label: this.$t('OK') }
      })
    }
  }
}
</script>
