<template>
  <div class="newsletter" data-test-id="Newsletter">
    <h2 class="t-text-primary t-text-lg t-font-bold t-mb-2">
      {{ $t('Get your {voucher_value} Voucher', { voucher_value }) }}
    </h2>
    <p class="t-text-sm t-mb-3 t-leading-tight">
      {{ $t('Get the Impericon Newsletter & and get yourself a {voucher_value} gift.', { voucher_value }) }}
    </p>
    <div class="t-flex t-mb-2 ">
      <label class="t-sr-only" for="newsletter-input">{{ $t('Your email address') }}</label>
      <input id="newsletter-input" type="text" value="" :placeholder="$t('Your email address')" @focus="showNewsletterPopup" class="t-flex t-flex-expand t-border t-border-r-0 t-border-base-light t-rounded-none t-rounded-tl-sm t-rounded-bl-sm t-text-sm t-h-10 t-px-2 t-leading-tight placeholder:t-text-base-light">
      <button type="submit" @click="showNewsletterPopup" class="t-flex t-items-center t-rounded-none t-border t-border-l-0 t-border-base-light t-rounded-tr-sm t-rounded-br-sm t-text-base-tone t-pr-2">
        <material-icon icon="send" />
        <span class="t-sr-only">{{ $t('Submit') }}</span>
      </button>
    </div>
    <i18n path="Data is not given to third parties and unsubscription is possible at any time. {policy}" tag="p" class="t-text-xs t-text-base-light t-leading-none t-mb-4">
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
import { mapGetters } from 'vuex'
import SubscriptionStatus from '@vue-storefront/core/modules/newsletter/mixins/SubscriptionStatus'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import { price } from '@vue-storefront/core/filters/price'

const NewsletterPopup = () => import(/* webpackChunkName: "vsf-newsletter-modal" */ 'theme/components/core/NewsletterPopup.vue')

export default {
  name: 'Newsletter',
  components: {
    MaterialIcon,
    NewsletterPopup
  },
  mixins: [ SubscriptionStatus ],
  computed: {
    ...mapGetters({
      storeConfig: 'icmaaConfig/getCurrentStoreConfig'
    }),
    voucher_value () {
      const config = this.storeConfig
      if (config.newsletter.voucher_value) {
        return config.newsletter.voucher_value
      }
      return price(5)
    }
  },
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
