<template>
  <transition name="fade">
    <div id="advice" v-if="advice && isOpen" class="t-w-full t-bg-alt-1 t-cursor-pointer t-text-sm t-text-white" @click="redirect">
      <div class="t-container t-h-50px t-flex t-justify-center t-items-center t-pl-4 lg:t-px-4">
        <div class="t-leading-tight" v-text="advice.text" />
        <button-component class="t-hidden lg:t-flex t-flex-fix t-ml-4 t-t-text-xs t-uppercase t-text-white" type="ghost-custom" custom-color="white" size="sm">
          {{ advice.buttonText }}
        </button-component>
        <button-component type="transparent-white" icon="close" :icon-only="true" @click.stop.native="close" class="t-flex-fix">
          {{ $t('Close') }}
        </button-component>
      </div>
      <div />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'Advice',
  components: {
    ButtonComponent
  },
  data () {
    return {
      isOpen: true
    }
  },
  methods: {
    close () {
      this.$store.dispatch('claims/set', { claimCode: 'adviceClaimAccepted', value: true })
      this.isOpen = false
    },
    redirect () {
      this.$router.push(this.localizedRoute(this.advice.link))
    }
  },
  computed: {
    ...mapGetters({
      'advice': 'icmaaAdvice/getSingleAdvice'
    })
  },
  async mounted () {
    await this.$store.dispatch('claims/check', { claimCode: 'adviceClaimAccepted' })
      .then(async claim => {
        if (!claim) {
          this.isOpen = true
          await this.$store.dispatch('claims/set', { claimCode: 'adviceClaimAccepted', value: false })
        } else {
          this.isOpen = !claim.value
        }
      })

    if (this.isOpen) {
      this.$store.dispatch('icmaaAdvice/list')
    }
  }
}
</script>
