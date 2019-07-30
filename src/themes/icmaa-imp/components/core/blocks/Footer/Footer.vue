<template>
  <footer>
    <div class="t-bg-white t-py-6 t-px-4">
      <div class="t-flex t-justify-between t-mb-6 ">
        <template v-for="(path, icon) in socialMediaIcons">
          <router-link :key="icon" :to="path" class="t-flex t-flex-fix t-items-center t-justify-center t-w-10 t-h-10 t-rounded-full t-bg-base-light t-text-2xl t-text-white">
            <material-icon :icon="icon" icon-set="icmaa" class="t-flex" />
          </router-link>
        </template>
      </div>
      <div class="t-flex t-justify-between t-flex-wrap t-mb-6 t--mx-2 t--mb-4">
        <template v-for="(name, path) in carrierLogos">
          <div :key="path" class="t-flex t-w-1/3 sm:t-w-auto t-flex-initial t-justify-center t-px-2 t-pb-4">
            <div class="t-flex t-flex-initial t-w-24 t-h-12 t-items-center t-justify-center t-border t-border-base-lighter t-rounded-sm t-p-2 sm:t-p-4">
              <retina-image :image="`/assets/logos/${path}.png`" class="t-flex t-max-w-full" />
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="t-bg-black t-p-4">
      <div class="t-flex t-flex-wrap t-items-center t-justify-center t-leading-loose">
        <router-link to="" class="t-flex-initial t-px-3 t-text-white t-text-xs t-uppercase">
          Test
        </router-link>
        <router-link to="" class="t-flex-initial t-px-3 t-text-white t-text-xs t-uppercase">
          Test
        </router-link>
        <router-link to="" class="t-flex-initial t-px-3 t-text-white t-text-xs t-uppercase">
          Test
        </router-link>
        <div class="t-flex-expand t-hidden sm:t-flex" />
        <div class="t-hidden sm:t-flex t-text-white t-text-xs t-uppercase">
          &copy; Impericon is a Division of IC Music and Apparel GmbH
        </div>
      </div>
    </div>

    <newsletter class=" flex brdr-bottom-1 brdr-cl-secondary" v-if="!isCheckoutPage" />
    <back-to-top bottom="20px" right="20px" visibleoffset="200">
      <button type="button" class="btn-top button no-outline brdr-none cl-white bg-cl-mine-shaft :bg-cl-th-secondary py10 px10">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
          <path d="M23.245 20l-11.245-14.374-11.219 14.374-.781-.619 12-15.381 12 15.391-.755.609z" fill="white" />
        </svg>
      </button>
    </back-to-top>
    <language-switcher v-if="multistoreEnabled" />
  </footer>
</template>

<script>
import CurrentPage from 'theme/mixins/currentPage'
import LanguageSwitcher from '../../LanguageSwitcher.vue'
import Newsletter from 'theme/components/core/blocks/Footer/Newsletter'
import BackToTop from 'theme/components/core/BackToTop'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import RetinaImage from 'theme/components/core/blocks/RetinaImage'
import config from 'config'

export default {
  mixins: [ CurrentPage ],
  name: 'MainFooter',
  computed: {
    multistoreEnabled () {
      return config.storeViews.multistore
    },
    socialMediaIcons () {
      return {
        'facebook': '',
        'instagram': '',
        'twitter': '',
        'tumblr': '',
        'ic-magazine': ''
      }
    },
    carrierLogos () {
      return {
        'payment/paypal': 'PayPal',
        'payment/amazonpayment': 'AmazonPayment',
        'payment/klarna': 'Klarna',
        'payment/visa': 'VISA',
        'payment/mastercard': 'MasterCard',
        'shipping/dhl': 'DHL'
      }
    }
  },
  components: {
    MaterialIcon,
    RetinaImage,
    Newsletter,
    LanguageSwitcher,
    BackToTop
  }
}
</script>
