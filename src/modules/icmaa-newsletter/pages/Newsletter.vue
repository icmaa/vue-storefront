<template>
  <div
    id="newsletter-page"
    :headline="content.headline"
  >
    <div class="t-container">
      <div class="t--mx-4 t-mb-8 t-flex t-flex-wrap t-px-4 md:t-mx-0 md:t-mt-4 lg:t-w-full">
        <PictureComponent
          :alt="content.header.alt"
          :src="content.header.img"
          :width="780"
          :height="240"
          :placeholder="true"
          :sizes="sizes"
          ratio="13:4"
          class="t-flex-1 t-self-start"
        />
      </div>
    </div>

    <div
      class="newsletter t-m-4 t-bg-white t-p-4 lg:t-container lg:t-mx-auto lg:t-my-8 lg:t-w-1/2 lg:t-p-8"
      data-test-id="Newsletter"
    >
      <h1 class="t-text-2xl t-leading-7 t-text-primary">
        {{ $t("Get the Impericon Newsletter & and get yourself a {voucher_value} gift.", { voucher_value: newsletterVoucherValue }) }}
      </h1>

      <ul class="t-my-4 lg:t-my-8">
        <li
          v-for="(why, index) in content.whys"
          :key="index"
          class="t-my-1 lg:t-my-2"
        >
          <i class="material-icons t-ml-2 t-align-middle t-text-4xl t-text-base-lighter">keyboard_arrow_right</i>
          {{ why.point }}
        </li>
      </ul>

      <div class="t-mt-4 t-flex lg:t-mt-0">
        <input
          type="text"
          value=""
          :placeholder="$t('Your email address')"
          class="t-flex t-h-10 t-flex-expand t-rounded-none t-rounded-l-sm t-border t-border-r-0 t-border-base-light t-px-2 t-text-sm t-leading-tight placeholder:t-text-base-light"
          @focus="showNewsletterPopup"
        >
        <button
          type="submit"
          class="t-flex t-items-center t-rounded-none t-rounded-r-sm t-border t-border-l-0 t-border-base-light t-bg-white t-pr-2 t-text-base-tone"
          @click="showNewsletterPopup"
        >
          <MaterialIcon icon="send" />
          <span class="t-sr-only">{{ $t('Submit') }}</span>
        </button>
      </div>
      <p
        class="t-mt-4 t-text-xs t-text-base-light lg:t-mt-2"
        v-html="content.hint"
      />
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
      <NewsletterPopup v-if="loadNewsletterPopup" />
    </div>
  </div>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import NewsletterMixin from 'theme/mixins/newsletterMixin'
import SubscriptionStatus from '@vue-storefront/core/modules/newsletter/mixins/SubscriptionStatus'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import PictureComponent from 'theme/components/core/blocks/Picture'

const NewsletterPopup = () => import(/* webpackChunkName: "vsf-newsletter-modal" */ 'theme/components/core/NewsletterPopup.vue')

export default {
  name: 'Newsletter',
  components: {
    MaterialIcon,
    NewsletterPopup,
    PictureComponent
  },
  mixins: [ Page, NewsletterMixin, SubscriptionStatus ],
  data () {
    return {
      loadNewsletterPopup: false,
      dataType: 'yaml'
    }
  },
  computed: {
    sizes () {
      return [
        // Order high-to-low is important
        { media: 'xl', width: 1248 },
        { media: 'lg', width: 992 },
        { media: 'sm', width: 768 },
        { media: 'xs', width: 640 },
        { width: 415 }
      ]
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
