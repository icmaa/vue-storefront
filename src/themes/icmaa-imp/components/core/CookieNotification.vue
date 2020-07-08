<template>
  <transition name="fade">
    <div class="cookie t-absolute t-bottom-0 t-z-10 t-w-full t-h-full" v-if="isOpen" data-test-id="CookieNotification">
      <div class="t-container t-bg-white t-w-11/12 lg:t-w-3/5 xl:t-w-1/2 t-my-6 lg:t-mt-20">
        <div class="t-flex t-flex-col t-items-center t-p-8 t-text-sm">
          <div class="t-w-full t-text-1xl t-text-base-dark t-font-medium t-mb-4">
            {{ $t('Cookie settings') }}
          </div>

          <!-- Info text -->
          <div class="t-text-base-tone t-text-xs t-mb-4">
            {{ $t('We use cookies on our website. Some of them are required to operate the website (e.g. for the use of your shopping basket or for security features). Others help us to improve our online services and to remain profitable. You have the power to accept non essential or only essential cookies. Please note that you may not be able to access all of our website settings if you have opted for certain criteria. You can view and adjust your settings at any time and deselect cookies later (e.g. in the footer of our website). For more information please read our') }}
            <router-link :to="localizedRoute('service-privacy')" class="t-inline-block t-text-base-darkest t-text-sm">
              <material-icon id="icon" icon="arrow_forward" size="xs" />
              <span class="t-text-black t-text-xs t-font-bold">
                {{ $t('Privacy statements') }}
              </span>
            </router-link>
          </div>

          <!-- Checkboxes -->
          <div class="t-flex t-text-lg t-items-center t-justify-center t-mb-4 t-z-1">
            <base-checkbox class="t-mr-4" name="essential" id="essential" :value="true">
              {{ $t('Essential') }}
            </base-checkbox>
            <base-checkbox class="" name="marketing" id="marketing" v-model="accepted">
              {{ $t('Marketing') }}
            </base-checkbox>
          </div>

          <!-- Disclaimer -->
          <div class="t-flex t-items-center t-w-full t-mb-4 t-justify-between lg:t--mt-12 lg:t-mb-8">
            <router-link :to="localizedRoute('service-imprint')" class="t-flex t-items-center t-text-base-darkest">
              <material-icon icon="arrow_forward" size="xs" />
              <div class="t-font-bold t-text-xs">
                {{ $t('Legal notice') }}
              </div>
            </router-link>

            <div class="t-flex t-items-center t-text-base-darkest t-cursor-pointer" @click="showDetails = !showDetails">
              <div class="t-text-black t-font-bold t-select-none t-text-xs" size="sm">
                {{ $t('Details') }}
              </div>
              <material-icon :icon="showDetails ? 'expand_less' : 'expand_more'" />
            </div>
          </div>

          <!-- Details section -->
          <div v-show="showDetails" class="t-mb-6">
            <h2 class="t-font-bold t-text-xs">
              {{ $t('Essential') }}
            </h2>
            <p class="t-mb-4 t-text-xs">
              {{ $t('These cookies are indispensable to operate the website and enable security relevant functionalities. With these kind of cookies we can identify whether or not you want to stay logged in. Therefore we can offer you our services faster the next time you visit our website.') }}
            </p>
            <h2 class="t-font-bold t-text-xs">
              {{ $t('Marketing and Statistics') }}
            </h2>
            <p class="t-text-xs">
              {{ $t('We collect anonymised data for statistical analysis and to further improve our offering across our website. With these cookies, we can for instance, analyse the number of visitors and the effectiveness of single sites. This helps us to optimize our content. We also use marketing cookies to show you personalized content which fits your interests. Thus we can present you offerings, which are highly relevant for you. Furthermore we use cookies that make it easier for you to use our website.') }}
            </p>
          </div>

          <!-- Buttons -->
          <div class="t-flex t-w-full t-flex-col lg:t-flex-row lg:t-justify-center">
            <button-component size="md" type="alt-3" class="t-w-full lg:t-w-1/2 xl:t-w-1/3 t-mb-4 lg:t-mr-4" @click="accepted=true">
              {{ $t('Select all') }}
            </button-component>
            <button-component size="md" type="ghost" class="t-w-full lg:t-w-1/2 xl:t-w-1/3" @click="accept">
              {{ $t('Confirm') }}
            </button-component>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import ButtonComponent from 'theme/components/core/blocks/Button'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'

export default {
  name: 'CookieNotification',
  components: {
    ButtonComponent,
    MaterialIcon,
    BaseCheckbox
  },
  props: {
    detailsLinkText: {
      type: String,
      default: i18n.t('See details')
    },
    detailsLink: {
      type: String,
      default: '/service-imprint'
    },
    message: {
      type: String,
      default: i18n.t('We are using cookies to give you the best experience on our site.')
    },
    messageSub: {
      type: String,
      default: i18n.t('By continuing to use our website without changing the settings, you are agreeing to our use of cookies.')
    }
  },
  data () {
    return {
      isOpen: false,
      showDetails: false,
      accepted: false
    }
  },
  methods: {
    accept () {
      this.setVisited()
      this.isOpen = false
    },
    async setVisited () {
      await this.$store.dispatch('claims/set', { claimCode: 'cookiesAccepted', value: this.accepted })
      this.$bus.$emit('cookiesAccepted', this.accepted)
    }
  },
  created () {
    this.$store.dispatch('claims/check', { claimCode: 'cookiesAccepted' }).then((cookieClaim) => {
      if (!cookieClaim) {
        this.isOpen = true
        this.$store.dispatch('claims/set', { claimCode: 'cookiesAccepted', value: false })
      } else {
        this.isOpen = !cookieClaim.value
      }
    })
  },
  watch: {
    $route (to, from) {
      (to.params.identifier === 'service-imprint' || to.params.identifier === 'service-privacy') ? this.isOpen = false : this.isOpen = true
    }
  }
}
</script>

<style lang="scss" scoped>
.cookie {
  background-color: rgba(0,0,0,.4);
  top: 0;
  left: 0;
}
input[type="checkbox"]:checked {
  mix-blend-mode: luminosity;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#icon {
  vertical-align: middle;
}
</style>
