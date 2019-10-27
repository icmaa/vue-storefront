<template>
  <div>
    <div v-if="hasRedirect">
      {{ $t('You need to be logged in to see this page') }}
    </div>
    <form class="" @submit.prevent="login" novalidate>
      <base-input
        class="t-mb-4" type="email" name="email" v-model="email"
        @blur="$v.email.$touch()"
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
        v-model="password"
        @blur="$v.password.$touch()"
        :placeholder="$t('Password *')"
        :validations="[
          {
            condition: !$v.password.required && $v.password.$error,
            text: $t('Field is required.')
          }
        ]"
      />
      <div class="t-flex t-items-start t-justify-between t-mb-4">
        <base-checkbox class="t-mr-4" id="remember" v-model="remember">
          <span class="t-text-base">{{ $t('Remember me') }}</span>
        </base-checkbox>
        <a href="#" @click.prevent="remindPassword">
          {{ $t('Forgot the password?') }}
        </a>
      </div>
      <button-component type="primary" class="t-w-full t-mb-2" data-testid="loginSubmit">
        {{ $t('Log in to your account') }}
      </button-component>
      <button-component type="facebook" icon="facebook" icon-set="icmaa" icon-position="left" class="t-w-full t-mb-2">
        {{ $t('Log in with facebook') }}
      </button-component>
      <button-component type="transparent" class="t-w-full" @click="switchElem" data-testid="registerLink">
        {{ $t('Register an account') }}
      </button-component>
    </form>
  </div>
</template>

<script>
import Login from '@vue-storefront/core/compatibility/components/blocks/Auth/Login'

import BaseCheckbox from '../Form/BaseCheckbox.vue'
import BaseInput from '../Form/BaseInput.vue'
import { required, email } from 'vuelidate/lib/validators'
import ButtonComponent from 'theme/components/core/blocks/Button'
import TopButton from 'theme/components/theme/blocks/AsyncSidebar/TopButton'

export default {
  components: {
    BaseCheckbox,
    BaseInput,
    ButtonComponent,
    TopButton
  },
  mixins: [Login],
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
    close (e) {
      if (e) localStorage.removeItem('redirect')
      this.$bus.$emit('modal-hide', 'modal-signup')
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-error: color(error);
$white: color(white);
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-close {
  cursor: pointer;
}
.modal-content {
  @media (max-width: 400px) {
    padding-left: 20px;
    padding-right: 20px;
  }
}
.redirect-error {
  background-color: $color-error;
  color: $white;
}
</style>
