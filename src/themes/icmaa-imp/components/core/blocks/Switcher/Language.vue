<template>
  <modal name="modal-switcher" :width="650">
    <p slot="header">
      {{ $t('Choose your country') }}
    </p>

    <div class="t-flex t-flex-wrap">
      <div class=" t-w-full sm:t-w-1/2 t-p-1">
        <a href="/" class="t-flex t-items-center t-border t-border-base-lighter t-rounded-sm t-p-1" :class="{ 't-bg-base-lightest': config.i18n.defaultCountry === currentStoreView.i18n.defaultCountry }">
          <flag-icon :iso="config.i18n.defaultCountry" class="t-border t-border-base-lightest t-mx-2" format="4x3" width="60" height="45" />
          <div class="t-text-sm">
            {{ config.i18n.fullCountryName }}
          </div>
        </a>
      </div>

      <div class="t-w-full sm:t-w-1/2 t-p-1" v-for="(storeView, storeCode) in storeViews" :key="storeCode" v-if="!storeView.disabled && typeof storeView === 'object' && storeView.i18n">
        <a :href="storeView.url" class="t-flex t-items-center t-border t-border-base-lighter t-rounded-sm t-p-1" :class="{ 't-bg-base-lightest': storeView.storeId === currentStoreView.storeId }">
          <flag-icon :iso="storeView.i18n.defaultCountry" class="t-border t-border-base-lightest t-mx-2" format="4x3" width="60" height="45" />
          <div class="t-text-sm">{{ storeView.i18n.fullCountryName }}</div>
        </a>
      </div>
    </div>
  </modal>
</template>

<script>
import config from 'config'
import Modal from 'theme/components/core/Modal.vue'
import FlagIcon from 'theme/components/core/blocks/FlagIcon'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  components: {
    Modal,
    FlagIcon
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
    storeViews () {
      return config.storeViews
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
