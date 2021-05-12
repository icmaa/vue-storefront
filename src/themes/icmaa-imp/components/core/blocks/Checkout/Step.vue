<template>
  <div class="step t-relative" :class="[ 'step-' + name, { 't-cursor-pointer': done } ]" @click="editSection">
    <div class="t-absolute t-h-full t-w-8" v-if="!last">
      <div class="t-w-px t-bg-base-lightest t-h-full t-mx-auto" />
    </div>
    <div class="t-flex t-items-center t-relative" :class="{ 't-pb-4': !last }">
      <div
        class="t-flex t-items-center t-justify-center t-h-8 t-w-8 t-mr-4 t-rounded-full t-bg-base-lightest t-text-white t-font-mono t-font-bold t-text-sm t-leading-1-em"
        :class="{ 't-text-base-tone': active || done }"
      >
        <material-icon v-if="done" icon="check" size="sm" class="t-text-alt-1" />
        <span v-else v-text="index" />
      </div>
      <h2 class="t-flex-auto t-font-light t-text-xl" :class="{ 't-text-base-lighter': !active && !done }">
        <slot name="header">
          {{ title || name }}
        </slot>
      </h2>
    </div>
    <div v-if="active || done" class="t-pl-12 t-pb-8">
      <slot />
    </div>
  </div>
</template>

<script>

import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'CheckoutStep',
  components: {
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
      this.$emit('edit-section', this.name)
    }
  }
}
</script>
