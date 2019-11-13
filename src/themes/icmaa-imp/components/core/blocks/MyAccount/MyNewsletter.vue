<template>
  <div class="t-p-4 t-bg-white">
    <!-- My newsletter header -->
    <headline icon="account_circle">
      {{ $t('My newsletter') }}
    </headline>

    <base-checkbox class="t-w-full t-px-2 t-mb-4" id="generalAgreement" v-model="user.isSubscribed">
      {{ $t('I want to receive a newsletter, and agree to its terms') }}
    </base-checkbox>

    <div class="t-w-full t-px-2">
      <button-component type="primary" @click.native="updateNewsletter" class="t-w-full lg:t-w-auto">
        {{ $t('Update my preferences') }}
      </button-component>
    </div>
  </div>
</template>

<script>
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
import { Newsletter } from '@vue-storefront/core/modules/newsletter/components/Newsletter'
import BaseCheckbox from '../Form/BaseCheckbox.vue'
import i18n from '@vue-storefront/i18n'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'MyNewsletter',
  components: {
    ButtonComponent,
    BaseCheckbox,
    Headline
  },
  methods: {
    async updateNewsletter () {
      if (this.user.isSubscribed) {
        const isSubscribed = await this.$store.dispatch('newsletter/subscribe', this.email)

        if (isSubscribed) {
          this.$store.dispatch('notification/spawnNotification', {
            type: 'success',
            message: i18n.t('You have been successfully subscribed to our newsletter!'),
            action1: { label: i18n.t('OK') }
          })
        }
        return
      }

      const isUnsubscribed = await this.$store.dispatch('newsletter/unsubscribe', this.email)
      if (isUnsubscribed) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: i18n.t('You have been successfully unsubscribed from our newsletter!'),
          action1: { label: i18n.t('OK') }
        })
      }
    }
  },
  mixins: [Newsletter]
}
</script>
