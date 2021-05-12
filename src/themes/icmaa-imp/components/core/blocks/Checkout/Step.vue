<template>
  <div class="step t-relative" :class="[ 'step-' + name ]">
    <div class="t-absolute t-h-full t-w-8">
      <div class="t-w-px t-bg-base-lightest t-h-full t-mx-auto" />
    </div>
    <div class="t-flex t-items-center t-pb-4 t-relative">
      <div
        v-text="index"
        class="t-flex t-items-center t-justify-center t-h-8 t-w-8 t-mr-4 t-rounded-full t-bg-base-lightest"
        :class="{ 't-text-base-light': !active }"
      />
      <h2 class="t-flex-auto" :class="[ active ? 't-font-bold' : 't-text-base-lighter' ]">
        <slot name="header">
          {{ title || name }}
        </slot>
      </h2>
    </div>
    <div v-if="active" class="t-pl-12 t-pb-4">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutStep',
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
    }
  }
}
</script>
