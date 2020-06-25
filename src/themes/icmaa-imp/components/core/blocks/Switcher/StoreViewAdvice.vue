<template>
  <modal name="modal-storeview-advice" :width="500" @close="onClose">
    <div slot="header">
      {{ $t('Change language?') }}
    </div>
    <div class="t-flex t-flex-wrap t--mx-2 t--mb-4">
      <div class="t-w-full t-px-2 t-pb-4 t-text-sm">
        <div class="t-mb-2">
          {{ $t('You apperantly switched to another language. Did you intend to do so?') }}
        </div>
        <div class="t-font-bold t-mb-4">
          {{ $t('Please be aware that you might need to login again or refill your cart if you switch to a new language.') }}
        </div>
        <div class="t-flex t-flex-wrap">
          <button-component type="primary" @click="goBack" class="t-w-full t-mb-2 lg:t-mb-0 lg:t-w-1/2">
            {{ $t('Ok, take me back') }}
          </button-component>
          <button-component type="transparent" @click="closeModal" class="t-w-full lg:t-w-1/2">
            {{ $t('Thanks, I\'ll stay') }}
          </button-component>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import Modal from 'theme/components/core/Modal.vue'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  components: {
    Modal,
    ButtonComponent
  },
  props: {
    current: {
      type: [Boolean, Object],
      default: false
    }
  },
  computed: {
    currentStoreView () {
      return currentStoreView()
    },
    storeViews () {
      return config.icmaa.languageSwitcher.map(l => ({
        url: l[0],
        storeCode: l[1],
        languageCode: l[2],
        name: l[3]
      }))
    }
  },
  methods: {
    setLanguageAccepted (storeCode) {
      const value = { accepted: true, storeCode }
      this.$store.dispatch('claims/set', { claimCode: 'languageAccepted', value })
    },
    onClose () {
      this.setLanguageAccepted(this.currentStoreView.storeCode)
    },
    goBack () {
      this.$router.push('/' + this.current.storeCode)
      this.closeModal()
    },
    closeModal () {
      this.$bus.$emit('modal-hide', 'modal-storeview-advice')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true
      this.$bus.$emit('modal-show', 'modal-storeview-advice')
    })
  }
}
</script>
