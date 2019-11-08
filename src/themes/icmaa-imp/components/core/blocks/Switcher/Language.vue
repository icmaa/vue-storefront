<template>
  <modal name="modal-switcher" :width="650">
    <p slot="header">
      {{ $t('Choose your country') }}
    </p>

    <div class="t-flex t-flex-wrap">
      <div class="t-w-1/2 t-p-1">
        <language-button :store-view="{ url: '/', i18n: { fullCountryName: config.i18n.fullCountryName, defaultCountry: config.i18n.defaultCountry } }" :is-current="config.i18n.defaultCountry === currentStoreView.i18n.defaultCountry" />
      </div>

      <div class="t-w-1/2 t-p-1" v-for="(storeView, storeCode) in config.storeViews" :key="storeCode" v-if="!storeView.disabled && typeof storeView === 'object' && storeView.i18n">
        <language-button :store-view="storeView" :is-current="storeView.storeId === currentStoreView.storeId" />
      </div>
    </div>
  </modal>
</template>

<script>
import config from 'config'
import Modal from 'theme/components/core/Modal.vue'
import LanguageButton from 'theme/components/core/blocks/Switcher/LanguageButton'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  components: {
    Modal,
    LanguageButton
  },
  data () {
    return {
      componentLoaded: false
    }
  },
  computed: {
    currentStoreView () {
      return currentStoreView()
    },
    config () {
      return config
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true
      this.$bus.$emit('modal-show', 'modal-switcher')
    })
  },
  methods: {
    close () {
      this.$bus.$emit('modal-hide', 'modal-switcher')
    }
  }
}
</script>
