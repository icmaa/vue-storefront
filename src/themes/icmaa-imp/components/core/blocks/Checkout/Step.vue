<template>
  <div
    class="step t-relative"
    :class="[ 'step-' + name, { 't-cursor-pointer': done } ]"
    @click="editSection"
  >
    <div
      v-if="!last"
      class="t-absolute t-h-full t-w-8"
    >
      <div class="t-mx-auto t-h-full t-w-px t-bg-base-lightest" />
    </div>
    <div
      class="t-relative t-flex t-items-start"
      :class="{ 't-pb-4': !last && !active && !done }"
    >
      <div
        class="t-mr-4 t-flex t-h-8 t-w-8 t-items-center t-justify-center t-rounded-full t-bg-base-lightest t-font-mono t-text-sm t-font-bold t-leading-1-em t-text-white"
        :class="{ 't-text-base-tone': active || done }"
      >
        <material-icon
          v-if="done"
          icon="check"
          size="sm"
          class="t-text-alt-3"
        />
        <span
          v-else
          v-text="index"
        />
      </div>
      <h2
        class="t-flex-auto t-self-center t-text-xl t-font-light"
        :class="{ 't-text-base-lighter': !active && !done }"
      >
        <slot name="header">
          {{ title || name }}
        </slot>
      </h2>
    </div>
    <div
      v-if="active || done"
      class="t-pb-8 t-pl-12 t-pt-4"
    >
      <no-ssr>
        <slot />
      </no-ssr>
    </div>
  </div>
</template>

<script>

import NoSsr from 'vue-no-ssr'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'CheckoutStep',
  components: {
    NoSsr,
    MaterialIcon
  },
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: [String, Boolean],
      default: false
    },
    index: {
      type: Number,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    done: {
      type: Boolean,
      default: false
    },
    last: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    editSection () {
      if (this.active || !this.done) return
      this.$store.dispatch('checkout/activateSection', this.name)
    }
  }
}
</script>
