<template>
  <Modal
    name="modal-storeview-advice"
    :width="500"
    :compact="true"
    data-test-id="ModalStoreViewAdvice"
    @close="onClose"
  >
    <div slot="header">
      {{ $t('Switched store?') }}
    </div>
    <div class="t--mx-2 t--mb-4 t-flex t-flex-wrap">
      <div class="t-w-full t-px-2 t-pb-4 t-text-sm">
        <div class="t-mb-2">
          {{ $t('You apperantly switched to another store. Did you intend to do so?') }}
        </div>
        <div class="t-mb-4 t-font-bold">
          {{ $t('Please be aware that you might need to login again or refill your cart if you switch to a new language.') }}
        </div>
        <div class="t-flex t-flex-wrap">
          <ButtonComponent
            type="primary"
            class="t-mb-2 t-w-full lg:t-mb-0 lg:t-w-1/2"
            @click="goBack"
          >
            {{ $t('Ok, take me back') }}
          </ButtonComponent>
          <ButtonComponent
            type="transparent"
            class="t-w-full lg:t-w-1/2"
            @click="closeModal"
          >
            {{ $t('Thanks, I\'ll stay') }}
          </ButtonComponent>
        </div>
      </div>
    </div>
  </Modal>
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
  mounted () {
    this.$nextTick(() => {
      this.$store.dispatch('ui/showModal', 'modal-storeview-advice')
    })
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
    },
    closeModal () {
      this.$store.dispatch('ui/hideModal', 'modal-storeview-advice')
      this.setLanguageAccepted(this.currentStoreView.storeCode)
    }
  }
}
</script>
