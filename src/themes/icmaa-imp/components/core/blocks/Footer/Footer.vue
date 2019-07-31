<template>
  <footer>
    <div class="t-bg-white t-py-6">
      <div class="t-container t-px-4">
        <div class="t--mx-4 md:t-flex">
          <div class="social-media t-mb-6 md:t-w-1/3 t-px-4">
            <h4 class="t-hidden md:t-block t-text-sm t-text-base-tone t-mb-4">
              {{ $t("You can find us on") }}
            </h4>
            <div class="t-flex t-flex-wrap t-justify-between lg:t-justify-start">
              <template v-for="(path, icon) in socialMediaIcons">
                <router-link :key="icon" :to="path" class="t-flex t-flex-fix t-items-center t-justify-center t-w-10 t-h-10 t-rounded-full t-bg-base-light t-text-2xl t-text-white sm:t-mb-2 md:sm:t-mb-0 lg:t-mr-4">
                  <material-icon :icon="icon" icon-set="icmaa" class="t-flex" />
                </router-link>
              </template>
            </div>
          </div>
          <div class="service-carrier t-px-4 t-mb-4 md:t-w-1/3 md:t-justify-start md:t-content-start">
            <h4 class="t-hidden md:t-block t-text-sm t-text-base-tone t-mb-4">
              {{ $t("Payments & Shipping") }}
            </h4>
            <div class="logos t-flex t-justify-between t-flex-wrap t--mx-2">
              <template v-for="(name, path) in carrierLogos">
                <div :key="path" class="t-flex t-flex-initial t-w-1/3 t-justify-center t-px-2 t-pb-4">
                  <div class="t-flex t-flex-initial t-h-12 t-mw-24 t-w-full t-py-2 t-px-1 t-items-center t-justify-center t-border t-border-base-lighter t-rounded-sm">
                    <retina-image :image="`/assets/logos/${path}.png`" :alt="name" class="t-flex t-max-w-full" />
                  </div>
                </div>
              </template>
            </div>
          </div>
          <newsletter class="t-px-4 md:t-w-1/3" />
        </div>
      </div>
    </div>
    <div class="footer-navigation t-bg-black t-py-4">
      <div class="t-container t-px-4">
        <div class="t--mx-4 lg:t-flex">
          <div class="t-flex t-w-full t-flex-wrap t-items-center t-justify-center t-leading-looser">
            <template v-for="(link, index) in navigation">
              <router-link :to="link.route" class="t-flex-initial t-px-4 t-text-white t-text-xs t-uppercase" :key="index">
                {{ link.name }}
              </router-link>
            </template>
            <div class="t-hidden t-flex-expand lg:t-flex" />
            <div class="copyright t-px-4 t-hidden lg:t-flex t-text-white t-text-xs t-uppercase" v-html="copyright" />
          </div>
        </div>
      </div>
    </div>
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
  name: 'MainFooter',
  components: {
    MaterialIcon,
    RetinaImage,
    Newsletter,
    LanguageSwitcher,
    BackToTop
  },
  mixins: [ CurrentPage ],
  computed: {
    multistoreEnabled () {
      return config.storeViews.multistore
    },
    socialMediaIcons () {
      return {
        'facebook': '',
        'instagram': '',
        'youtube': '',
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
    },
    navigation () {
      return [
        {
          name: 'Service',
          route: '/service'
        },
        {
          name: 'Impressum',
          route: '/service'
        },
        {
          name: 'AGB',
          route: '/service'
        },
        {
          name: 'Datenschutz',
          route: '/service'
        },
        {
          name: 'Model',
          route: '/service'
        },
        {
          name: 'Jobs',
          route: '/service'
        },
        {
          name: 'Partner werden',
          route: '/service'
        }
      ]
    },
    copyright () {
      return '&copy; Impericon is a Division of IC Music and Apparel GmbH'
    }
  }
}
</script>

<style lang="scss" scoped>

@media (max-width: 360px) {
  .service-carrier .logos > div {
    width: 33.333333%;
  }
}

</style>
