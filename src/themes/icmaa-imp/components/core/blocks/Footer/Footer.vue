<template>
  <footer>
    <div class="t-bg-white t-py-6">
      <div class="t-container t-px-4">
        <div class="t--mx-4 md:t-flex">
          <div class="t-mb-6 t-px-4 md:t-mb-0 md:t-w-1/3">
            <div class="social-media">
              <h2 class="t-mb-4 t-hidden t-text-sm t-text-base-tone md:t-block">
                {{ $t("You can find us on") }}
              </h2>
              <div class="t-flex t-flex-wrap t-justify-between md:t-justify-start">
                <template v-for="(icon, index) in socialMediaIcons">
                  <a
                    :key="index"
                    :href="icon.href"
                    :title="icon.name"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="t-mb-2 t-mr-2 t-flex t-h-10 t-w-10 t-flex-fix t-items-center t-justify-center t-rounded-full t-bg-base-light t-text-white md:t-h-8 md:t-w-8 lg:t-h-10 lg:t-w-10"
                  >
                    <MaterialIcon
                      :icon="icon.icon"
                      icon-set="icmaa"
                      class="t-flex md:t-text-lg lg:t-text-2xl"
                    />
                  </a>
                </template>
              </div>
            </div>
            <div
              v-if="multistoreEnabled"
              class="country t-mt-4 t-hidden md:t-block"
            >
              <h2 class="t-mb-4 t-text-sm t-text-base-tone">
                {{ $t('Choose your country') }}
              </h2>
              <div class="t--mx-2 t-flex t-flex-wrap">
                <template v-for="(store, index) in languages">
                  <a
                    :key="index"
                    :href="store.href"
                    :title="store.label"
                    class="t-mx-2 t-mb-2"
                  >
                    <FlagIcon
                      :iso="store['iso-code']"
                      width="20"
                      height="20"
                    />
                  </a>
                </template>
              </div>
            </div>
          </div>
          <div class="service-carrier t-mb-4 t-px-4 md:t-mb-0 md:t-w-1/3 md:t-content-start md:t-justify-start">
            <h2 class="t-mb-4 t-hidden t-text-sm t-text-base-tone md:t-block">
              {{ $t("Payments & Shipping") }}
            </h2>
            <div
              ref="serviceLogos"
              class="logos lazyload t--mx-2 t-flex t-flex-wrap t-justify-between"
            >
              <template v-for="(logo, index) in carrierLogos">
                <div
                  :key="index"
                  class="t-flex t-w-1/3 t-flex-initial t-justify-center t-px-2 t-pb-4"
                >
                  <div class="t-flex t-h-12 t-w-full t-flex-initial t-items-center t-justify-center t-rounded-sm t-border t-border-base-lighter t-px-1 t-py-2">
                    <router-link
                      :to="localizedRoute(logo.route)"
                      :title="$t('Service')"
                    >
                      <div
                        :class="logo.path"
                        class="t-flex t-max-w-full"
                      />
                    </router-link>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <Newsletter class="t-px-4 md:t-mb-0 md:t-w-1/3" />
        </div>
      </div>
    </div>
    <div
      ref="footerNavigation"
      class="footer-navigation t-bg-black t-py-4"
    >
      <div class="t-container t-px-4">
        <div class="t--mx-4 lg:t-flex">
          <div class="t-flex t-w-full t-flex-wrap t-items-center t-justify-center t-leading-looser">
            <template v-for="(link, index) in metaNavigation">
              <router-link
                :key="index"
                :to="localizedRoute(link.route)"
                class="t-flex-initial t-px-4 t-text-xs t-uppercase t-text-white"
              >
                {{ link.name }}
              </router-link>
            </template>
            <a
              href="#"
              onClick="UC_UI.showSecondLayer(); return false;"
              class="t-flex-initial t-px-4 t-text-xs t-uppercase t-text-white"
            >
              {{ $t("Privacy Settings") }}
            </a>
            <div class="t-hidden t-flex-expand lg:t-flex" />
            <div
              class="copyright t-hidden t-px-4 t-text-xs t-uppercase t-text-white lg:t-flex"
              v-html="copyright"
            />
          </div>
        </div>
      </div>
    </div>
    <BackToTop :visible-offset-bottom="footerNavigationOffset" />
    <LanguageSwitcher v-if="multistoreEnabled" />
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
  },
  methods: {
    setFooterNavigationOffset: throttle(function () {
      this.footerNavigationOffset = this.$refs.footerNavigation.clientHeight
    }, 500)
  }
}
</script>

<style lang="scss">

@import "theme/css/base/_sprite-footer-logos.scss";

.service-carrier .logos:not(.lazyload) {
  @include retina-sprites($retina-groups)
}

</style>
