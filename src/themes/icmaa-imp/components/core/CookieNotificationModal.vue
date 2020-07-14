<template>
  <modal name="modal-cookie-notification" :width="600" :show-close-button="false" @close="close" data-test-id="CookieNotification">
    <div slot="header">
      {{ $t('Cookie settings') }}
    </div>
    <div class="t-flex t-flex-col t-items-center">
      <!-- Info text -->
      <div class="t-text-base-tone t-text-sm t-leading-5 t-mb-6">
        {{ $t('We use cookies on our website. Some of them are required to operate the website (e.g. for the use of your shopping basket or for security features). Others help us to improve our online services and to remain profitable. You have the power to accept non essential or only essential cookies. Please note that you may not be able to access all of our website settings if you have opted for certain criteria. You can view and adjust your settings at any time and deselect cookies later (e.g. in the footer of our website). For more information please read our') }}
        <router-link :to="localizedRoute('service-privacy')" class="t-inline-block t-text-base-darkest">
          <material-icon icon="arrow_forward" size="xs" class="t-align-middle" />
          <span class="t-text-black t-text-xs t-font-bold">
            {{ $t('Privacy statements') }}
          </span>
        </router-link>
      </div>

      <!-- Checkboxes -->
      <div class="t-grid t-w-full t-grid-rows-2 lg:t-grid-rows-1 t-grid-cols-4 t-mb-4 lg:t-mb-8">
        <router-link :to="localizedRoute('service-imprint')" class="t-flex t-items-center t-text-base-darkest t-row-start-2 lg:t-row-start-1 t-col-span-2 lg:t-col-span-1">
          <material-icon icon="arrow_forward" size="xs" class="t-mr-1" />
          <div class="t-font-bold t-text-xs">
            {{ $t('Legal notice') }}
          </div>
        </router-link>

        <div class="t-row-start-1 t-col-span-4 lg:t-col-span-2 t-flex t-items-center t-justify-center t-mb-2 lg:t-mb-0">
          <base-checkbox class="t-mr-4" name="essential" id="essential" :value="true">
            {{ $t('Essential') }}
          </base-checkbox>
          <base-checkbox class="" name="marketing" id="marketing" v-model="accepted">
            {{ $t('Marketing') }}
          </base-checkbox>
        </div>

        <div class="t-row-start-2 lg:t-row-start-1 t-col-span-2 lg:t-col-span-1 t-flex t-justify-end t-items-center t-text-base-darkest t-cursor-pointer" @click="showDetails = !showDetails">
          <div class="t-text-black t-font-bold t-select-none t-text-xs" size="sm">
            {{ $t('Details') }}
          </div>
          <material-icon :icon="showDetails ? 'expand_less' : 'expand_more'" class="t-ml-1" />
        </div>
      </div>

      <!-- Details section -->
      <div v-show="showDetails" class="t-mb-6 t-text-sm t-leading-5">
        <h2 class="t-font-bold">
          {{ $t('Essential') }}
        </h2>
        <p class="t-mb-4">
          {{ $t('These cookies are indispensable to operate the website and enable security relevant functionalities. With these kind of cookies we can identify whether or not you want to stay logged in. Therefore we can offer you our services faster the next time you visit our website.') }}
        </p>
        <h2 class="t-font-bold">
          {{ $t('Marketing and Statistics') }}
        </h2>
        <p>
          {{ $t('We collect anonymised data for statistical analysis and to further improve our offering across our website. With these cookies, we can for instance, analyse the number of visitors and the effectiveness of single sites. This helps us to optimize our content. We also use marketing cookies to show you personalized content which fits your interests. Thus we can present you offerings, which are highly relevant for you. Furthermore we use cookies that make it easier for you to use our website.') }}
        </p>
      </div>

      <!-- Buttons -->
      <div class="t-flex t-w-full t-flex-col lg:t-flex-row lg:t-justify-center">
        <button-component size="md" type="alt-3" class="t-w-full lg:t-w-1/2 xl:t-w-1/3 t-mb-4 lg:t-mr-4" @click="acceptAll">
          {{ $t('Select all') }}
        </button-component>
        <button-component size="md" type="ghost" class="t-w-full lg:t-w-1/2 xl:t-w-1/3" @click="accept">
          {{ $t('Confirm') }}
        </button-component>
      </div>
    </div>
  </modal>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import Modal from 'theme/components/core/Modal.vue'
import ButtonComponent from 'theme/components/core/blocks/Button'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import { claimCollection } from 'theme/store/claims'

export default {
  name: 'CookieNotificationModal',
  components: {
    Modal,
    ButtonComponent,
    MaterialIcon,
    BaseCheckbox
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      showDetails: false,
      accepted: false
    }
  },
  mounted () {
    if (this.visible === true) {
      this.$store.dispatch('ui/showModal', 'modal-cookie-notification')
    }
  },
  watch: {
    visible (value) {
      if (value === true) {
        this.$store.dispatch('ui/showModal', 'modal-cookie-notification')
      }
    }
  },
  methods: {
    accept () {
      this.setVisited()
    },
    acceptAll () {
      this.accepted = true
      this.setVisited()
    },
    async setVisited () {
      await this.$store.dispatch('claims/set', { claimCode: 'cookiesAccepted', value: this.accepted })
      this.$bus.$emit('cookiesAccepted', this.accepted)
      this.$store.dispatch('ui/hideModal', 'modal-cookie-notification')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
