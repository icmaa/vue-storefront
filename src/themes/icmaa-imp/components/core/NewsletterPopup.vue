<template>
  <Modal
    name="modal-newsletter"
    :title="$t('Newsletter')"
    :width="400"
  >
    <form
      v-if="!isSubscribedToNewsletter"
      novalidate
      @submit.prevent="subscribe(onSuccesfulSubmission)"
    >
      <p class="t-mb-4 t-text-sm">
        {{ $t('Sign up to our newsletter and receive a coupon for {voucher_value} off!', { voucher_value: newsletterVoucherValue }) }}
      </p>
      <BaseInput
        v-model="email"
        focus
        type="email"
        name="email"
        class="t-mb-4"
        :placeholder="$t('E-mail address *')"
        :validations="[
          {
            condition: $v.email.$error && !$v.email.required,
            text: $t('Field is required')
          },
          {
            condition: !$v.email.email && $v.email.$error,
            text: $t('Please provide valid e-mail address.')
          }
        ]"
      />
      <ButtonComponent
        class="t-w-full"
        type="primary"
        :submit="true"
        @click="$v.email.$touch"
      >
        {{ $t('Subscribe') }}
      </ButtonComponent>
    </form>
    <div v-else>
      {{ $t('Oh great, you are already subscribed.') }}
      <i18n
        path="You can manage your subscription in your {account-settings}."
        tag="div"
        class="t-text-xs t-text-base-light"
      >
        <template #account-settings>
          <router-link
            :to="localizedRoute('/my-account/newsletter')"
            class="t-text-base-light t-underline"
          >
            {{ $t('account settings') }}
          </router-link>
        </template>
      </i18n>
    </div>
  </Modal>
</template>
<script>
import i18n from '@vue-storefront/i18n'
import { required, email } from 'vuelidate/lib/validators'

import NewsletterMixin from 'theme/mixins/newsletterMixin'
import Modal from 'theme/components/core/Modal'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'NewsletterPopup',
  components: {
    Modal,
    BaseInput,
    ButtonComponent
  },
  mixins: [ NewsletterMixin ],
  data () {
    return {
      email: '',
      user: {
        isSubscribed: false
      }
    }
  },
  validations: {
    email: {
      required,
      email
    }
  },
  beforeMount () {
    if (this.$store.state.user.current) {
      this.onLoggedIn()
    }
    this.$bus.$on('user-after-loggedin', this.onLoggedIn)
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('ui/showModal', 'modal-newsletter')
    })
  },
  beforeDestroy () {
    this.$bus.$off('user-after-loggedin', this.onLoggedIn)
  },
  methods: {
    async onLoggedIn () {
      this.email = this.$store.state.user.current.email
      this.user.isSubscribed = await this.$store.dispatch('newsletter/status', this.email)
    },
    subscribe (success, failure) {
      // argument omitted for validation purposes
      if (!this.$v.$invalid) {
        return this.$store.dispatch('newsletter/subscribe', this.email).then(res => {
          if (success) success(res)
        }).catch(err => {
          if (failure) failure(err)
        })
      }
    },
    onSuccesfulSubmission (isSubscribed) {
      if (isSubscribed) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: i18n.t('We are almost done. A confirmation email has been send to your email address.'),
          action1: { label: i18n.t('OK') }
        })

        this.$store.dispatch('ui/hideModal', 'modal-newsletter')
      }
    }
  }
}
</script>
