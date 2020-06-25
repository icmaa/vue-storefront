<template>
  <div class="">
    <modal-switcher v-if="loadLanguagesModal" :change-store-advice="changeStoreAdvice" />
    <modal-advice v-if="loadLanguageAdviceModal" :current="claim.value" />
  </div>
</template>

<script>
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { coreHooksExecutors } from '@vue-storefront/core/hooks'

const ModalSwitcher = () => import(/* webpackChunkName: "vsf-languages-modal" */ 'theme/components/core/blocks/Switcher/Language.vue')
const ModalAdvice = () => import(/* webpackChunkName: "vsf-storeview-advice-modal" */ 'theme/components/core/blocks/Switcher/StoreViewAdvice.vue')

export default {
  components: {
    ModalSwitcher,
    ModalAdvice
  },
  data () {
    return {
      claim: false,
      loadLanguagesModal: false,
      loadLanguageAdviceModal: false,
      changeStoreAdvice: false,
      languageAccepted: false
    }
  },
  computed: {
    storeView () {
      return currentStoreView()
    },
    isCorrectStoreviewLanguage () {
      if (this.languageAccepted) {
        return true
      }

      const { defaultLocale, defaultLanguage } = this.storeView.i18n
      return this.browserLanguages.some(lang =>
        [defaultLocale, defaultLanguage].includes(lang) ||
        defaultLocale.startsWith(lang) ||
        defaultLanguage.startsWith(lang)
      ) || false
    },
    browserLanguages () {
      let found = [];
      if (typeof navigator !== 'undefined') {
        if (navigator.languages) {
          navigator.languages.forEach(l => found.push(l))
        }
        if (navigator.userLanguage) {
          found.push(navigator.userLanguage);
        }
        if (navigator.language) {
          found.push(navigator.language);
        }
      }

      return found.length > 0 ? found : undefined;
    }
  },
  methods: {
    async getClaim () {
      return this.$store.dispatch('claims/check', { claimCode: 'languageAccepted' })
    },
    showLanguagesModal (changeStoreAdvice = false) {
      this.loadLanguagesModal = true
      this.changeStoreAdvice = changeStoreAdvice

      this.$bus.$emit('modal-show', 'modal-switcher')
    },
    async onStoreSwitch (fetchClaim = false) {
      if (fetchClaim) {
        await this.getClaim()
      }

      if (
        this.claim &&
        this.languageAccepted === true &&
        this.storeView.storeCode !== this.claim.value.storeCode
      ) {
        this.loadLanguageAdviceModal = true
      }
    }
  },
  beforeMount () {
    this.$bus.$on('modal-toggle-switcher', this.showLanguagesModal)
  },
  async mounted () {
    this.claim = await this.getClaim()
    if (!this.claim) {
      const { storeCode } = this.storeView
      const value = { accepted: this.isCorrectStoreviewLanguage, storeCode }

      this.$store.dispatch(
        'claims/set',
        { claimCode: 'languageAccepted', value }
      )
    } else {
      this.languageAccepted = this.claim.value.accepted
      this.onStoreSwitch()
    }

    coreHooksExecutors.afterStoreViewChanged(storeView => {
      this.onStoreSwitch(true)
    })

    if (!this.isCorrectStoreviewLanguage) {
      this.showLanguagesModal(true)
    }
  }
}
</script>
