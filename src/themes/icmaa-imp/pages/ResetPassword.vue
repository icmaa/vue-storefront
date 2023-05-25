<template>
  <div class="reset-password t-container t-p-4">
    <div class="t-bg-white t-p-4 lg:t-p-8">
      <h2 class="t-mb-2 t-text-xl t-text-base-tone">
        {{ $t('Reset password') }}
      </h2>
      <form
        class="reset-password t--mx-4 t-flex t-flex-wrap"
        @submit.prevent="resetPassword"
      >
        <div class="t-mb-4 t-w-full t-px-4 lg:t-w-1/3">
          <BaseInput
            v-model="password"
            type="password"
            name="password"
            :label="$t('Password') + ' *'"
            :placeholder="$t('Password')"
            :validations="[
              {
                condition: !$v.password.required && $v.password.$error,
                text: $t('Field is required')
              },
              {
                condition: !$v.password.minLength && $v.password.$error,
                text: $t('Password must have at least 8 letters.')
              }
            ]"
            @blur="$v.password.$touch()"
          />
        </div>
        <div class="t-mb-4 t-w-full t-px-4 lg:t-w-1/3">
          <BaseInput
            v-model="rPassword"
            type="password"
            name="password-confirm"
            :label="$t('Repeat password') + ' *'"
            :placeholder="$t('Repeat password')"
            :validations="[
              {
                condition: !$v.rPassword.required && $v.rPassword.$error,
                text: $t('Field is required')
              },
              {
                condition: !$v.rPassword.sameAsPassword && $v.rPassword.$error,
                text: $t('Passwords must be identical.')
              }
            ]"
            @blur="$v.rPassword.$touch()"
          />
        </div>
        <div class="t-w-full t-px-4">
          <ButtonComponent :submit="true">
            {{ $t('Reset password') }}
          </ButtonComponent>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput.vue'
import ButtonComponent from 'theme/components/core/blocks/Button'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'ResetPassword',
  components: {
    ButtonComponent,
    BaseInput
  },
  data () {
    return {
      email: this.$route.query.email,
      password: '',
      rPassword: ''
    }
  },
  validations: {
    password: {
      required,
      minLength: minLength(8)
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password')
    }
  },
  mounted () {
    if (!this.$route.query.email || !this.$route.query.token) {
      this.$store.dispatch('ui/showModal', 'modal-signup')
      this.$store.commit('ui/setAuthElem', 'forgot-pass')
      this.$router.push(this.localizedHomeRoute)
    }
  },
  methods: {
    async resetPassword () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }

      try {
        this.$store.dispatch('ui/loader', { message: i18n.t('Please wait') })

        let response = await this.$store.dispatch('user/createPassword', {
          email: this.email,
          newPassword: this.password,
          resetToken: this.$route.query.token
        })

        if (response.code === 200) {
          if (this.$store.state.config.users.loginAfterCreatePassword) {
            let loginResult = await this.$store.dispatch('user/login', {
              username: this.email,
              password: this.password
            })

            this.$store.dispatch('ui/loader', false)

            if (loginResult.code !== 200) {
              this.$store.dispatch('notification/spawnNotification', {
                action1: { label: i18n.t('OK') },
                message: i18n.t('Something went wrong, sorry'),
                type: 'error'
              })
            } else {
              this.$store.dispatch('notification/spawnNotification', {
                action1: { label: i18n.t('OK') },
                message: i18n.t('Sucessfully changed password'),
                type: 'success'
              })

              this.$router.push(this.localizedHomeRoute);
            }
          }
        } else {
          this.$store.dispatch('ui/loader', false)

          const responseMessage = response.result && response.result.errorMessage && response.result.errorMessage.includes('No such entity with email')
            ? i18n.t('Provided email does not exist')
            : response.result.errorMessage

          this.$store.dispatch('notification/spawnNotification', {
            action1: { label: i18n.t('OK') },
            message: responseMessage,
            type: 'error'
          })
        }
      } catch (err) {
        this.$store.dispatch('ui/loader', false)

        await this.$store.dispatch('notification/spawnNotification', {
          action1: { label: i18n.t('OK') },
          message: i18n.t('Something went wrong, sorry'),
          type: 'error'
        })
      }
    }
  },
  metaInfo () {
    return {
      meta: [
        { vmid: 'robots', name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  }
}
</script>
