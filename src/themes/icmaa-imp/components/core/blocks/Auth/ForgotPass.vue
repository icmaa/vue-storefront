<template>
  <form
    v-if="!passwordSent"
    novalidate
    @submit.prevent="sendEmail"
  >
    <p class="t-mb-4 t-text-sm">
      {{ $t('Enter your email address. After submit you will receive an email with an reset-link.') }}
    </p>
    <base-input
      v-model="email"
      type="email"
      name="email"
      focus
      :placeholder="$t('E-mail address *')"
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
      class="t-mb-4"
    />
    <button-component
      :submit="true"
      type="primary"
      class="t-mb-2 t-w-full"
    >
      {{ $t('Reset password') }}
    </button-component>
    <button-component
      type="transparent"
      class="t--mb-2 t-w-full"
      @click="switchElem"
    >
      {{ $t('Return to log in') }}
    </button-component>
  </form>
  <div v-else>
    <p class="t-mb-4">
      {{ $t("We've sent password reset instructions to your email. Check your inbox and follow the link.") }}
    </p>
    <button-component
      class="t-w-full"
      @click="switchElem"
    >
      {{ $t('Back to login') }}
    </button-component>
  </div>
</template>

<script>

import i18n from '@vue-storefront/i18n'
import { required, email } from 'vuelidate/lib/validators'
import { Logger } from '@vue-storefront/core/lib/logger'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'ForgotPass',
  components: {
    BaseInput,
    ButtonComponent
  },
  data () {
    return {
      email: '',
      passwordSent: false
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    close () {
      this.$store.dispatch('ui/hideModal', 'modal-signup')
    },
    sendEmail () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      this.$store.dispatch('ui/loader', { message: i18n.t('Resetting the password ... ') })
      this.$store.dispatch('user/resetPassword', { email: this.email }).then((response) => {
        this.$store.dispatch('ui/loader', false)
        if (response.code === 200) {
          this.passwordSent = true
        } else {
          this.$store.dispatch('notification/spawnNotification', {
            type: 'error',
            message: i18n.t(response.result) || i18n.t('Error while sending reset password e-mail'),
            action1: { label: i18n.t('OK'), action: 'close' }
          })
        }
      }).catch((err) => {
        Logger.error(err)()
        this.$store.dispatch('ui/loader', false)
      })
    },
    switchElem () {
      this.$store.commit('ui/setAuthElem', 'login')
    }
  }
}
</script>
