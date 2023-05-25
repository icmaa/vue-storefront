<template>
  <div class="t-bg-white t-p-4">
    <Headline>
      {{ $t('My newsletter') }}
    </Headline>
    <BaseCheckbox
      id="generalAgreement"
      v-model="isSubscribed"
      class="t-mb-4 t-w-full t-px-2"
      name="generalAgreement"
    >
      {{ $t('I want to receive a newsletter, and agree to its terms') }}
    </BaseCheckbox>
    <div class="t-w-full t-px-2">
      <ButtonComponent
        type="primary"
        class="t-w-full lg:t-w-auto"
        @click.native="updateNewsletter"
      >
        {{ $t('Update my preferences') }}
      </ButtonComponent>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Headline from 'theme/components/core/blocks/MyAccount/Headline'
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
  data () {
    return {
      isSubscribed: false,
      text_unsubscribe: 'You have been successfully unsubscribed from our newsletter!',
      text_subscribe: 'We are almost done. A confirmation email has been send to your email address.'
    }
  },
  computed: {
    ...mapGetters({
      getIsSubscribed: 'newsletter/isSubscribed',
      customer: 'user/getCustomer'
    })
  },
  mounted () {
    this.isSubscribed = this.customer ? this.getIsSubscribed : false
  },
  methods: {
    updateNewsletter () {
      const message = this.isSubscribed ? this.text_unsubscribe : this.text_subscribe
      const customer = Object.assign({}, this.customer, { is_subscribed: this.isSubscribed })
      this.$bus.$emit('myAccount-before-updateUser', customer, false, message)
    }
  }
}
</script>
