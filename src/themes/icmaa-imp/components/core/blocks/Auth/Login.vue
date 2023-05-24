<template>
  <form
    novalidate
    data-test-id="Login"
    @submit.prevent="login"
  >
    <div
      v-if="hasRedirect"
      class="t-mb-4 t-text-sm"
    >
      {{ $t('You need to be logged in to see this page') }}
    </div>
    <BaseInput
      id="email"
      ref="emailInput"
      v-model="email"
      type="email"
      name="email"
      :class="[ showAll ? 't-mb-4' : 't-mb-2' ]"
      :placeholder="$t('E-mail address') + ' *'"
      :validations="[
        {
          condition: !$v.email.required && $v.email.$error,
          text: $t('Field is required')
        },
        {
          condition: !$v.email.email && $v.email.$error,
          text: $t('Please provide valid e-mail address.')
        }
      ]"
      @focus="hasFocus=true"
    />
    <BaseInput
      v-show="showAll"
      id="password"
      v-model="password"
      class="t-mb-4"
      type="password"
      name="password"
      :placeholder="$t('Password') + ' *'"
      :validations="[
        {
          condition: !$v.password.required && $v.password.$error,
          text: $t('Field is required')
        }
      ]"
    />
    <div
      v-show="showAll"
      class="t-mb-4 t-flex t-items-center t-justify-between"
    >
      <div
        href="#"
        class="t-cursor-pointer t-text-sm"
        @click.prevent="callForgotPassword"
      >
        {{ $t('Forgot the password?') }}
      </div>
    </div>
    <div class="t--mx-1 t-flex t-flex-wrap">
      <div
        class="t-w-full t-px-1"
        :class="{ 'lg:t-w-auto lg:t-min-w-1/3': !isModal }"
      >
        <ButtonComponent
          :submit="true"
          type="primary"
          class="t-mb-2 t-w-full"
          data-test-id="loginSubmit"
        >
          {{ $t('Login') }}
        </ButtonComponent>
      </div>
      <NoSsr>
        <div
          class="t-w-full t-px-1"
          :class="{ 'lg:t-flex-1': !isModal }"
        >
          <FacebookLoginButton
            class="t-mb-2 t-w-full"
          />
        </div>
      </NoSsr>
      <div class="t-w-full t-px-1">
        <ButtonComponent
          :type="isModal ? 'transparent' : 'primary'"
          class="t--mb-2 t-w-full t-flex-wrap"
          data-test-id="registerLink"
          @click="callRegister"
        >
          {{ $t('Not yet an account?') }} <span class="t-ml-1">{{ $t('Register now') }}</span>
        </ButtonComponent>
      </div>
    </div>
  </form>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import { mapGetters } from 'vuex'
import { Logger } from '@vue-storefront/core/lib/logger'

import { required, email } from 'vuelidate/lib/validators'

import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonComponent from 'theme/components/core/blocks/Button'
import FacebookLoginButton from 'theme/components/core/blocks/Auth/FacebookLoginButton'
import NoSSR from 'vue-no-ssr'

export default {
  name: 'Login',
  components: {
    BaseInput,
    ButtonComponent,
    FacebookLoginButton,
    NoSsr: NoSSR
  },
  props: {
    isModal: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data () {
    return {
      email: '',
      password: '',
      hasRedirect: !!localStorage.getItem('redirect'),
      hasFocus: false
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  computed: {
    ...mapGetters({
      authRedirect: 'ui/getAuthRedirect'
    }),
    showAll () {
      const hasInput = this.email.length > 0 || this.password.length > 0
      return this.isModal || (!this.isModal && (this.hasFocus || hasInput))
    }
  },
  methods: {
    login () {
      if (!this.isModal && !this.showAll) {
        this.$refs.emailInput.setFocus()
        return
      }

      if (this.$v.$invalid) {
        this.$v.$touch()

        if (!this.isModal) return

        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: i18n.t('Please fix the validation errors'),
          action1: { label: i18n.t('OK') }
        })
        return
      }

      this.callLogin()
    },
    callLogin () {
      this.$store.dispatch('ui/loader', { message: i18n.t('Please wait') })
      this.$store.dispatch('user/login', { username: this.email, password: this.password }).then((result) => {
        this.$store.dispatch('ui/loader', false)

        if (result.code !== 200) {
          this.onFailure(result)
        } else {
          this.onSuccess()
          this.close()
        }
      }).catch(err => {
        Logger.error('Error while login:', 'user', err)()
        this.onFailure({ result: 'Unexpected authorization error. Check your Network connection.' })
        this.$store.dispatch('ui/loader', false)
      })
    },
    callRegister () {
      if (!this.isModal) {
        this.$emit('call-register')
      }
      this.$store.commit('ui/setAuthElem', 'register')
    },
    callForgotPassword () {
      if (!this.isModal) {
        this.$store.dispatch('ui/showModal', 'modal-signup')
      }
      this.$store.commit('ui/setAuthElem', 'forgot-pass')
    },
    onSuccess () {
      if (this.authRedirect) {
        this.$router.push(this.authRedirect)
        this.$store.commit('ui/setAuthRedirect')
      }

      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: i18n.t('You are logged in!'),
        action1: { label: i18n.t('OK') }
      })
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: i18n.t(result.result),
        action1: { label: i18n.t('OK') }
      })
    },
    close () {
      this.$store.dispatch('ui/hideModal', 'modal-signup')
    }
  }
}
</script>
