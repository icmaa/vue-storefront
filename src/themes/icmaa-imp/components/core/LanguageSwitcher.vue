<template>
  <div>
    <modal-switcher v-if="loadLanguagesModal" :store-recommendation-advice="storeRecommendationAdvice" :change-store-advice="isStoreAdviceVisible" />
    <modal-advice v-if="loadLanguageAdviceModal" :current="claim.value" />
  </div>
</template>

<script>
import config from 'config'
import { Logger } from '@vue-storefront/core/lib/logger'
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
      storeRecommendationAdvice: false,
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
    },
    isStoreAdviceVisible () {
      if (!this.claim || !config.icmaa.storeViewSwitch.showAdvice) {
        return false
      }

      return this.languageAccepted
    }
  },
  methods: {
    async getClaim () {
      return this.$store.dispatch('claims/check', { claimCode: 'languageAccepted' })
    },
    showLanguagesModal (storeRecommendationAdvice = false) {
      this.loadLanguagesModal = true
      this.storeRecommendationAdvice = storeRecommendationAdvice

      this.$store.dispatch('ui/showModal', 'modal-switcher')
    },
    async onStoreViewChanged (fetchClaim = false) {
      if (fetchClaim) {
        await this.getClaim()
      }

      if (
        this.isStoreAdviceVisible &&
        this.storeView.storeCode !== this.claim.value.storeCode
      ) {
        Logger.log('Toggle store-view advice', 'icmaa-imp-theme', this.claim)()
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
      this.languageAccepted = this.isCorrectStoreviewLanguage

      const { storeCode } = this.storeView
      const value = { accepted: this.languageAccepted, storeCode }

      this.$store.dispatch(
        'claims/set',
        { claimCode: 'languageAccepted', value }
      )
    } else {
      this.languageAccepted = this.claim.value.accepted
      this.onStoreViewChanged()
    }

    coreHooksExecutors.afterStoreViewChanged(storeView => {
      this.onStoreViewChanged(true)
    })

    if (!this.isCorrectStoreviewLanguage) {
      this.showLanguagesModal(true)
    }
  }
}
</script>
