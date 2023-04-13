<template>
  <footer>
    <div class="t-bg-white t-py-6">
      <div class="t-container t-px-4">
        <div class="t--mx-4 md:t-flex">
          <div class="t-mb-6 t-px-4 md:t-w-1/3 md:t-mb-0">
            <div class="social-media">
              <h2 class="t-hidden md:t-block t-text-sm t-text-base-tone t-mb-4">
                {{ $t("You can find us on") }}
              </h2>
              <div class="t-flex t-flex-wrap t-justify-between md:t-justify-start">
                <template v-for="(icon, index) in socialMediaIcons">
                  <a :key="index" :href="icon.href" :title="icon.name" target="_blank" rel="noopener noreferrer" class="t-flex t-flex-fix t-items-center t-justify-center t-w-10 t-h-10 t-rounded-full t-bg-base-light t-text-white md:t-w-8 md:t-h-8 lg:t-w-10 lg:t-h-10 t-mr-2 t-mb-2">
                    <material-icon :icon="icon.icon" icon-set="icmaa" class="t-flex md:t-text-lg lg:t-text-2xl" />
                  </a>
                </template>
              </div>
            </div>
            <div class="country t-hidden md:t-block t-mt-4" v-if="multistoreEnabled">
              <h2 class="t-text-sm t-text-base-tone t-mb-4">
                {{ $t('Choose your country') }}
              </h2>
              <div class="t-flex t-flex-wrap t--mx-2">
                <template v-for="(store, index) in languages">
                  <a :href="store.href" :title="store.label" :key="index" class="t-mx-2 t-mb-2">
                    <flag-icon :iso="store['iso-code']" width="20" height="20" />
                  </a>
                </template>
              </div>
            </div>
          </div>
          <div class="service-carrier t-px-4 t-mb-4 md:t-w-1/3 md:t-mb-0 md:t-justify-start md:t-content-start">
            <h2 class="t-hidden md:t-block t-text-sm t-text-base-tone t-mb-4">
              {{ $t("Payments & Shipping") }}
            </h2>
            <div class="logos lazyload t-flex t-justify-between t-flex-wrap t--mx-2" ref="serviceLogos">
              <template v-for="(logo, index) in carrierLogos">
                <div :key="index" class="t-flex t-flex-initial t-w-1/3 t-justify-center t-px-2 t-pb-4">
                  <div class="t-flex t-flex-initial t-h-12 t-w-full t-py-2 t-px-1 t-items-center t-justify-center t-border t-border-base-lighter t-rounded-sm">
                    <router-link :to="localizedRoute(logo.route)" :title="$t('Service')">
                      <div :class="logo.path" class="t-flex t-max-w-full" />
                    </router-link>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="t-mb-6 t-px-4 md:t-w-1/3 md:t-mb-0">
            <newsletter class="t-px-4 md:t-mb-0" />
            <div class="t-container services t-px-4 t-flex t-justify-end t-pt-4">
              <div class="impericon_services_logo">
                <a href="https://services.impericon.com">
                  <svg width="100%" height="100%" viewBox="0 0 1109 380" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                    <g transform="matrix(0.999468,0,0,0.976061,-352.793,-69.5743)">
                      <rect id="ArtBoard1" x="352.981" y="71.281" width="1109.24" height="388.609" style="fill:none;" />
                      <clipPath id="_clip1">
                        <rect id="ArtBoard11" serif:id="ArtBoard1" x="352.981" y="71.281" width="1109.24" height="388.609" />
                      </clipPath>
                      <g clip-path="url(#_clip1)">
                        <g transform="matrix(4.16888,0,0,4.26886,-0.297172,-10.5039)">
                          <path d="M85.123,19.064L350.748,19.064L350.748,75.984L142.045,75.984L85.123,19.064Z" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                          <path d="M261.463,47.333L255.773,41.758L255.773,37.712C255.773,37.254 255.479,37.025 254.895,37.025C254.291,37.025 253.984,37.254 253.984,37.712L253.984,57.24C253.984,57.701 254.291,57.93 254.895,57.93C255.479,57.93 255.773,57.701 255.773,57.24L255.773,46.965L261.463,52.645L261.463,57.43C261.463,58.762 260.799,59.834 259.474,60.64C258.143,61.446 256.644,61.846 254.972,61.846C250.149,61.846 247.73,60.161 247.73,56.781L247.73,38.667C247.73,35.017 250.149,33.194 254.972,33.194C259.295,33.194 261.463,34.855 261.463,38.178L261.463,47.333Z" style="fill:white;fill-rule:nonzero;" />
                          <path d="M238.026,61.636L244.197,61.633L244.197,39.673L238.026,33.487L238.026,61.636Z" style="fill:white;fill-rule:nonzero;" />
                          <path d="M292.555,46.333L289.005,33.5L281.973,33.5L281.973,61.64L287.129,66.834L287.129,46.646L291.349,61.64L297.711,61.64L297.711,33.5L292.555,33.5L292.555,46.333Z" style="fill:white;fill-rule:nonzero;" />
                          <path d="M174.181,48.111L171.346,33.507L163.392,33.507L163.392,61.654L168.229,61.654L168.229,45.853L171.922,61.654L176.181,61.654L179.408,45.853L179.408,61.654L184.915,67.23L184.915,33.507L176.632,33.507L174.181,48.111Z" style="fill:white;fill-rule:nonzero;" />
                          <path d="M196.493,45.743C196.493,46.736 195.8,47.233 194.425,47.233L194.425,37.507C195.8,37.507 196.493,38.005 196.493,38.999L196.493,45.743ZM200.638,34.466C199.386,33.813 197.477,33.487 194.897,33.487L188.405,33.487L188.405,61.629L194.425,67.661L194.425,51.255C197.775,51.31 199.957,50.953 200.985,50.184C202.002,49.423 202.517,48.12 202.517,46.271L202.517,38.467C202.517,36.455 201.891,35.119 200.638,34.466Z" style="fill:white;fill-rule:nonzero;" />
                          <path d="M228.502,43.121C228.502,44.108 227.682,44.602 226.421,44.602L226.421,37.081C227.682,37.081 228.502,37.567 228.502,38.538L228.502,43.121ZM230.675,46.151C233.199,45.387 234.464,43.928 234.464,41.766L234.464,38.428C234.464,36.719 233.825,35.469 232.548,34.681C231.276,33.889 229.773,33.497 228.052,33.497L220.313,33.497L220.313,61.661L226.421,61.661L226.421,47.974C227.697,47.974 228.523,48.446 228.523,49.392C228.523,49.445 228.529,59.549 228.529,61.636L234.479,67.569L234.481,50.76C234.481,48.283 233.213,46.746 230.675,46.151Z" style="fill:white;fill-rule:nonzero;" />
                          <path d="M205.337,61.642L217.432,61.642L217.432,58.026L211.511,58.026L211.511,48.131L216.781,48.131L216.781,44.726L211.511,44.726L211.511,37.129L217.56,37.129L217.56,33.507L205.337,33.507L205.337,61.642Z" style="fill:white;fill-rule:nonzero;" />
                          <path d="M153.965,61.658L160.099,61.654L160.099,33.493L153.965,27.305L153.965,61.658Z" style="fill:white;fill-rule:nonzero;" />
                          <path d="M272.742,57.187C272.742,57.751 272.407,58.032 271.739,58.032C271.045,58.032 270.697,57.751 270.697,57.187L270.697,37.99C270.697,37.425 271.045,37.143 271.739,37.143C272.407,37.143 272.742,37.425 272.742,37.99L272.742,57.187ZM271.768,33.271C267.031,33.271 264.663,35.098 264.663,38.756L264.663,56.892C264.663,60.272 267.02,61.962 271.726,61.962C273.827,61.962 275.524,61.523 276.821,60.637C278.123,59.75 278.775,58.491 278.775,56.852L278.775,38.714C278.775,35.085 276.44,33.271 271.768,33.271Z" style="fill:white;fill-rule:nonzero;" />
                          <g transform="matrix(0.24,0,0,0.24,84.7417,19.1584)">
                            <path d="M382.427,376.743L264.645,258.961L1105.03,258.961L1105.03,376.743L382.427,376.743Z" style="fill:white;" />
                          </g>
                          <path d="M149.501,81.858L349.436,81.858L349.436,108.916L176.559,108.916L149.501,81.858ZM350.737,108.916L350.737,81.858L350.748,81.858L350.748,80.52L146.269,80.52L176.005,110.255L350.748,110.255L350.748,108.916L350.737,108.916Z" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                          <path d="M229.984,97.495C229.984,98.423 229.651,99.155 228.983,99.689C228.314,100.224 227.385,100.49 226.194,100.49C225.097,100.49 224.126,100.285 223.282,99.872L223.282,97.846C223.977,98.156 224.564,98.373 225.044,98.501C225.525,98.626 225.964,98.69 226.363,98.69C226.841,98.69 227.208,98.598 227.464,98.417C227.72,98.233 227.846,97.961 227.846,97.601C227.846,97.399 227.79,97.22 227.677,97.062C227.565,96.905 227.4,96.754 227.183,96.608C226.964,96.463 226.52,96.231 225.849,95.913C225.221,95.616 224.75,95.333 224.436,95.061C224.121,94.789 223.87,94.473 223.682,94.112C223.496,93.75 223.401,93.328 223.401,92.846C223.401,91.936 223.711,91.221 224.327,90.7C224.943,90.18 225.795,89.92 226.883,89.92C227.418,89.92 227.928,89.983 228.413,90.109C228.899,90.236 229.406,90.414 229.936,90.644L229.232,92.34C228.684,92.115 228.23,91.957 227.872,91.868C227.512,91.778 227.16,91.734 226.813,91.734C226.4,91.734 226.084,91.831 225.864,92.023C225.643,92.214 225.533,92.465 225.533,92.775C225.533,92.968 225.578,93.135 225.667,93.278C225.755,93.422 225.897,93.56 226.092,93.693C226.286,93.827 226.748,94.067 227.474,94.414C228.436,94.873 229.094,95.335 229.45,95.796C229.807,96.258 229.984,96.825 229.984,97.495Z" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                          <path d="M239.348,100.35L233.426,100.35L233.426,90.067L239.348,90.067L239.348,91.854L235.606,91.854L235.606,94.112L239.088,94.112L239.088,95.897L235.606,95.897L235.606,98.55L239.348,98.55L239.348,100.35Z" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                          <path d="M245.261,94.631L245.964,94.631C246.654,94.631 247.163,94.518 247.49,94.287C247.819,94.057 247.984,93.697 247.984,93.204C247.984,92.717 247.815,92.369 247.48,92.163C247.145,91.957 246.626,91.854 245.922,91.854L245.261,91.854L245.261,94.631ZM245.261,96.404L245.261,100.35L243.081,100.35L243.081,90.067L246.077,90.067C247.475,90.067 248.508,90.322 249.178,90.831C249.85,91.34 250.185,92.112 250.185,93.148C250.185,93.753 250.018,94.291 249.685,94.762C249.352,95.234 248.881,95.603 248.271,95.869C249.819,98.181 250.827,99.675 251.296,100.35L248.876,100.35L246.421,96.404L245.261,96.404Z" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                          <path d="M259.896,90.067L262.096,90.067L258.601,100.35L256.224,100.35L252.736,90.067L254.938,90.067L256.871,96.186C256.979,96.547 257.09,96.968 257.204,97.449C257.32,97.929 257.392,98.263 257.42,98.451C257.471,98.02 257.648,97.264 257.948,96.186L259.896,90.067Z" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                          <rect x="265.062" y="90.067" width="2.181" height="10.283" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                          <path d="M275.706,91.734C274.885,91.734 274.249,92.043 273.799,92.659C273.349,93.276 273.124,94.135 273.124,95.238C273.124,97.529 273.985,98.676 275.706,98.676C276.427,98.676 277.302,98.496 278.329,98.135L278.329,99.964C277.485,100.314 276.542,100.49 275.501,100.49C274.005,100.49 272.862,100.037 272.069,99.13C271.276,98.222 270.88,96.92 270.88,95.222C270.88,94.153 271.075,93.217 271.464,92.413C271.853,91.608 272.413,90.992 273.142,90.563C273.871,90.134 274.725,89.92 275.706,89.92C276.703,89.92 277.707,90.161 278.716,90.644L278.013,92.416C277.628,92.234 277.24,92.074 276.852,91.938C276.463,91.803 276.081,91.734 275.706,91.734Z" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                          <path d="M287.894,100.35L281.972,100.35L281.972,90.067L287.894,90.067L287.894,91.854L284.152,91.854L284.152,94.112L287.635,94.112L287.635,95.897L284.152,95.897L284.152,98.55L287.894,98.55L287.894,100.35Z" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                          <path d="M297.765,97.495C297.765,98.423 297.432,99.155 296.764,99.689C296.095,100.224 295.166,100.49 293.975,100.49C292.878,100.49 291.907,100.285 291.063,99.872L291.063,97.846C291.758,98.156 292.345,98.373 292.825,98.501C293.306,98.626 293.745,98.69 294.144,98.69C294.622,98.69 294.989,98.598 295.245,98.417C295.501,98.233 295.627,97.961 295.627,97.601C295.627,97.399 295.571,97.22 295.458,97.062C295.346,96.905 295.181,96.754 294.964,96.608C294.745,96.463 294.301,96.231 293.63,95.913C293.002,95.616 292.531,95.333 292.217,95.061C291.902,94.789 291.651,94.473 291.463,94.112C291.277,93.75 291.182,93.328 291.182,92.846C291.182,91.936 291.492,91.221 292.108,90.7C292.724,90.18 293.576,89.92 294.664,89.92C295.199,89.92 295.709,89.983 296.194,90.109C296.68,90.236 297.187,90.414 297.717,90.644L297.013,92.34C296.465,92.115 296.011,91.957 295.653,91.868C295.293,91.778 294.941,91.734 294.594,91.734C294.181,91.734 293.865,91.831 293.645,92.023C293.424,92.214 293.314,92.465 293.314,92.775C293.314,92.968 293.359,93.135 293.448,93.278C293.536,93.422 293.678,93.56 293.873,93.693C294.067,93.827 294.529,94.067 295.255,94.414C296.217,94.873 296.875,95.335 297.231,95.796C297.588,96.258 297.765,96.825 297.765,97.495Z" style="fill:rgb(153,153,153);fill-rule:nonzero;" />
                        </g>
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-navigation t-bg-black t-py-4" ref="footerNavigation">
      <div class="t-container t-px-4">
        <div class="t--mx-4 lg:t-flex">
          <div class="t-flex t-w-full t-flex-wrap t-items-center t-justify-center t-leading-looser">
            <template v-for="(link, index) in metaNavigation">
              <router-link :to="localizedRoute(link.route)" class="t-flex-initial t-px-4 t-text-white t-text-xs t-uppercase" :key="index">
                {{ link.name }}
              </router-link>
            </template>
            <a href="#" onClick="UC_UI.showSecondLayer(); return false;" class="t-flex-initial t-px-4 t-text-white t-text-xs t-uppercase">
              {{ $t("Privacy Settings") }}
            </a>
            <div class="t-hidden t-flex-expand lg:t-flex" />
            <div class="copyright t-px-4 t-hidden lg:t-flex t-text-white t-text-xs t-uppercase" v-html="copyright" />
          </div>
        </div>
      </div>
    </div>
    <back-to-top :visible-offset-bottom="footerNavigationOffset" />
    <language-switcher v-if="multistoreEnabled" />
  </footer>
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'
import LanguageSwitcher from '../../LanguageSwitcher.vue'
import Newsletter from 'theme/components/core/blocks/Footer/Newsletter'
import BackToTop from 'theme/components/core/BackToTop'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import FlagIcon from 'theme/components/core/blocks/FlagIcon'

import throttle from 'lodash-es/throttle'

export default {
  name: 'MainFooter',
  components: {
    MaterialIcon,
    FlagIcon,
    Newsletter,
    LanguageSwitcher,
    BackToTop
  },
  data () {
    return {
      footerNavigationOffset: 0
    }
  },
  computed: {
    ...mapGetters('icmaaCmsBlock', ['getJsonBlockByIdentifier']),
    footer () {
      return this.getJsonBlockByIdentifier('footer')
    },
    languages () {
      return this.footer.languages
    },
    multistoreEnabled () {
      return config.storeViews.multistore
    },
    socialMediaIcons () {
      return this.footer.socialMediaIcons
    },
    carrierLogos () {
      return this.footer.carrierLogos
    },
    metaNavigation () {
      return this.footer.metaNavigation
    },
    copyright () {
      return this.footer.copyright
    }
  },
  methods: {
    setFooterNavigationOffset: throttle(function () {
      this.footerNavigationOffset = this.$refs.footerNavigation.clientHeight
    }, 500)
  },
  mounted () {
    window.addEventListener('resize', this.setFooterNavigationOffset)
    this.$nextTick(this.setFooterNavigationOffset)

    // Lazyload footer-logo sprite
    new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) e.target.classList.remove('lazyload')
      })
    }).observe(this.$refs.serviceLogos)
  },
  destroyed () {
    window.removeEventListener('resize', this.setFooterNavigationOffset)
  }
}
</script>

<style lang="scss">

@import "theme/css/base/_sprite-footer-logos.scss";

.service-carrier .logos:not(.lazyload) {
  @include retina-sprites($retina-groups)
}

.impericon_services_logo {
  width: 150px;
}

</style>
