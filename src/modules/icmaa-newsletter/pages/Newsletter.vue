<template>
  <div id="newsletter-page" :headline="content.headline">
    <div v-if="content.header.img" class="t-container">
      <div class="t--mx-4 md:t-mx-0 md:t-mt-4 lg:t-w-full t-flex t-flex-wrap t-px-4 t-mb-8">
        <img :src="getMediaThumbnail(content.header.img, 0, 0)" :alt="content.header.alt" :title="content.header.alt">
      </div>
    </div>

    <div class="newsletter t-p-4 lg:t-p-8 lg:t-w-1/2 t-bg-white t-m-4 lg:t-my-8 lg:t-container lg:t-mx-auto" data-test-id="Newsletter">
      <h1 class="t-text-2xl t-text-primary t-leading-7">
        {{ $t("Get the Impericon Newsletter & and get yourself a {voucher_value} gift.", { voucher_value: newsletterVoucherValue }) }}
      </h1>

      <ul class="t-my-4 lg:t-my-8">
        <li class="t-my-1 lg:t-my-2" v-for="(why, index) in content.whys" :key="index">
          <i class="t-text-base-lighter t-ml-2 material-icons t-text-4xl t-align-middle">keyboard_arrow_right</i>
          {{ why.point }}
        </li>
      </ul>

      <div class="t-flex t-mt-4 lg:t-mt-0">
        <input type="text" value="" :placeholder="$t('Your email address')" @focus="showNewsletterPopup" class="t-flex t-flex-expand t-border t-border-r-0 t-border-base-light t-rounded-none t-rounded-tl-sm t-rounded-bl-sm t-text-sm t-h-10 t-px-2 t-leading-tight placeholder:t-text-base-light">
        <button type="submit" @click="showNewsletterPopup" class="t-flex t-items-center t-rounded-none t-border t-border-l-0 t-border-base-light t-rounded-tr-sm t-rounded-br-sm t-text-base-tone t-pr-2 t-bg-white">
          <material-icon icon="send" />
          <span class="t-sr-only">{{ $t('Submit') }}</span>
        </button>
      </div>
      <p class="t-mt-4 lg:t-mt-2 t-text-base-light t-text-xs" v-html="content.hint" />
      <i18n path="Data is not given to third parties and unsubscription is possible at any time. {policy}" tag="p" class="t-text-xs t-text-base-light t-leading-none t-mb-4">
        <template #policy>
          <router-link :to="localizedRoute('/service-privacy')">
            {{ $t('Privacy Policy') }}
          </router-link>
        </template>
      </i18n>
      <newsletter-popup v-if="loadNewsletterPopup" />
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import NewsletterMixin from 'theme/mixins/newsletterMixin'
import SubscriptionStatus from '@vue-storefront/core/modules/newsletter/mixins/SubscriptionStatus'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

const NewsletterPopup = () => import(/* webpackChunkName: "vsf-newsletter-modal" */ 'theme/components/core/NewsletterPopup.vue')

export default {
  name: 'Newsletter',
  components: {
    MaterialIcon,
    NewsletterPopup
  },
  mixins: [ Page, NewsletterMixin, SubscriptionStatus ],
  data () {
    return {
      loadNewsletterPopup: false,
      dataType: 'yaml'
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
