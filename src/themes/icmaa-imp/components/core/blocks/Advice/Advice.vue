<template>
  <transition name="fade">
    <div class="t-w-full row-01 t-bg-alt-1 t-cursor-pointer" id="advice" v-if="advice && isOpen" @click="redirect">
      <div class="t-container t-flex t-items-center t-justify-between t-h-full t-text-white">
        <div class="" />
        <div>{{ advice.text }}</div>
        <button-component class="t-text-xs t-uppercase t-text-white" :type="'ghost-custom'" :custom-color="'white'">
          {{ advice.buttonText }}
        </button-component>
        <button-component class="t-justify-end" type="transparent-white" icon="close" :icon-only="true" @click.stop.native="close">
          {{ $t('Close') }}
        </button-component>
      </div>
      <div />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import { onlineHelper } from '@vue-storefront/core/helpers'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'Advice',
  props: {
    tags: {
      type: String,
      required: true
    }
  },
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
      this.isOpen = false
    },
    redirect () {
      this.$router.push(this.localizedRoute(this.advice.link))
      this.isOpen = false
    }
  },
  computed: {
    ...mapGetters('icmaaAdvice', ['getAdvice', 'getSingleAdvice']),
    allAdvices () {
      return this.getAdvice
    },
    advice () {
      return this.getSingleAdvice(this.tags)
    }
  },
  mounted () {
    this.$store.dispatch('icmaaAdvice/list')
  }
}
</script>

<style lang="scss" scoped>
.row-01 {
  height: 50px;
}
</style>
