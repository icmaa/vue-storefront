<template>
  <transition name="fade">
    <div
      v-if="advice && isOpen"
      id="advice"
      class="t-w-full t-cursor-pointer t-bg-alt-1 t-text-sm t-text-white"
      @click="redirect"
    >
      <div class="t-container t-flex t-h-50px t-items-center t-justify-center t-pl-4 lg:t-px-4">
        <div
          class="t-leading-tight"
          v-text="advice.text"
        />
        <button-component
          class="t-t-text-xs t-ml-4 t-hidden t-flex-fix t-uppercase t-text-white lg:t-flex"
          type="ghost-custom"
          custom-color="white"
          size="sm"
        >
          {{ advice.buttonText }}
        </button-component>
        <button-component
          type="transparent-white"
          icon="close"
          :icon-only="true"
          class="t-flex-fix"
          @click.stop.native="close"
        >
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
  },
  methods: {
    close () {
      this.$store.dispatch('claims/set', { claimCode: 'adviceClaimAccepted', value: true })
      this.isOpen = false
    },
    redirect () {
      this.$router.push(this.localizedRoute(this.advice.link))
    }
  }
}
</script>
