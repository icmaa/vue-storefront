<template>
  <div
    class="newsletter"
    data-test-id="Newsletter"
  >
    <h2 class="t-mb-2 t-text-lg t-font-bold t-text-primary">
      {{ $t('Get your {voucher_value} Voucher', { voucher_value: newsletterVoucherValue }) }}
    </h2>
    <p class="t-mb-3 t-text-sm t-leading-tight">
      {{ $t('Get the Impericon Newsletter & and get yourself a {voucher_value} gift.', { voucher_value: newsletterVoucherValue }) }}
    </p>
    <div class="t-mb-2 t-flex ">
      <label
        class="t-sr-only"
        for="newsletter-input"
      >{{ $t('Your email address') }}</label>
      <input
        id="newsletter-input"
        type="text"
        value=""
        :placeholder="$t('Your email address')"
        class="t-flex t-h-10 t-flex-expand t-rounded-none t-rounded-l-sm t-border t-border-r-0 t-border-base-light t-px-2 t-text-sm t-leading-tight placeholder:t-text-base-light"
        @focus="showNewsletterPopup"
      >
      <button
        type="submit"
        class="t-flex t-items-center t-rounded-none t-rounded-r-sm t-border t-border-l-0 t-border-base-light t-pr-2 t-text-base-tone"
        @click="showNewsletterPopup"
      >
        <material-icon icon="send" />
        <span class="t-sr-only">{{ $t('Submit') }}</span>
      </button>
    </div>
    <i18n
      path="Data is not given to third parties and unsubscription is possible at any time. {policy}"
      tag="p"
      class="t-mb-4 t-text-xs t-leading-none t-text-base-light"
    >
      <template #policy>
        <router-link :to="localizedRoute('/service-privacy')">
          {{ $t('Privacy Policy') }}
        </router-link>
      </template>
    </i18n>
    <newsletter-popup v-if="loadNewsletterPopup" />
  </div>
</template>

<script>
import SubscriptionStatus from '@vue-storefront/core/modules/newsletter/mixins/SubscriptionStatus'
import NewsletterMixin from 'theme/mixins/newsletterMixin'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

const NewsletterPopup = () => import(/* webpackChunkName: "vsf-newsletter-modal" */ 'theme/components/core/NewsletterPopup.vue')

export default {
  name: 'Newsletter',
  components: {
    MaterialIcon,
    NewsletterPopup
  },
  mixins: [ NewsletterMixin, SubscriptionStatus ],
  data () {
    return {
      loadNewsletterPopup: false
    }
  },
  methods: {
    showNewsletterPopup () {
      this.loadNewsletterPopup = true
      this.$store.dispatch('ui/showModal', 'modal-newsletter')
    }
  }
}
</script>
