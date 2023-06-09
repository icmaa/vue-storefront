<template>
  <div>
    <div
      v-if="!isAllowed"
      class="t-relative t-w-full t-cursor-pointer t-bg-white"
      :style="{ paddingTop: `${height}%` }"
      @click="showLayer()"
    >
      <div class="t-absolute t-left-0 t-top-0 t-flex t-h-full t-w-full t-flex-wrap t-content-center t-items-center t-justify-center">
        <MaterialIcon
          :icon="icon"
          :icon-set="iconSet"
          size="xl"
          class="t-mb-4 t-text-base-lighter"
        />
        <div class="t-w-full" />
        <div class="t-w-2/3 t-text-center t-text-base-light sm:t-w-2/4">
          <p class="t-mb-2">
            {{ $t('You\'ll need to accept our cookie-settings, to see this content.') }}
          </p>
          <p class="t-text-sm ">
            {{ $t('Click to setup your preferences.') }}
          </p>
        </div>
      </div>
    </div>
    <template v-if="isAllowed || hasScript">
      <slot />
    </template>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import LoadSdkMixin from 'icmaa-cms/mixins/LoadSdk'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon.vue'

export default {
  name: 'UserCentricsPlaceholder',
  components: {
    MaterialIcon
  },
  mixins: [LoadSdkMixin],
  props: {
    service: {
      type: String,
      required: true
    },
    ratio: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'public'
    },
    iconSet: {
      type: String,
      default: 'material'
    },
    script: {
      type: [Object, Boolean],
      default: false
    }
  },
  computed: {
    ...mapGetters({
      isServiceAllowed: 'userCentrics/isServiceAllowed'
    }),
    isAllowed () {
      return this.isServiceAllowed(this.service)
    },
    hasScript () {
      return !!this.script
    },
    height () {
      const ratio = this.ratio.split(':')
      return ratio[1] * 100 / ratio[0]
    }
  },
  watch: {
    isAllowed (v) {
      this.loadScript()
    }
  },
  mounted () {
    this.loadScript()
  },
  methods: {
    loadScript () {
      if (this.script && this.isAllowed) {
        const { src, id } = this.script
        this.loadSdkScript(src, id)
          .then(() => {
            this.$emit('script-loaded')
          })
      }
    },
    showLayer () {
      this.$store.dispatch('userCentrics/showMarketingLayer')
    }
  }
}
</script>
