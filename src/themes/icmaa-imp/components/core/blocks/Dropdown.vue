<template>
  <div class="t-relative">
    <div class="t-cursor-pointer" @click="toggle">
      <slot />
    </div>
    <div class="t-absolute t-mt-2 t-z-1 t-flex t-flex-wrap t-w-full t-shadow t-bg-white t-border t-border-base-lightest t-rounded-sm" v-show="open">
      <label v-for="(o, i) in filteredOptions" :key="'option-' + i" class="t-flex t-w-full t-border-base-lightest t-px-3 t-py-2 t-text-sm t-cursor-pointer" :class="[{ 't-bg-base-lightest t-text-primary': isCurrent(o.value) }, { 't-border-b': i !== options.length - 1 }]">
        {{ o.label }}
        <input type="radio" v-model="value" :name="name" :value="o.value" :selected="current === o.value" class="t-hidden" @change="select">
      </label>
    </div>
  </div>
</template>

<script>
/**
 * Based on CSS only dropdown
 * @see https://codepen.io/Aoyue/pen/rLExYX
 * */
export default {
  data () {
    return {
      value: this.current,
      open: false
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    current: {
      type: [String, Number],
      default: ''
    },
    hideSelected: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    filteredOptions () {
      return this.hideSelected ? this.options.filter(o => !this.isCurrent(o.value)) : this.options
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
    },
    isCurrent (v) {
      return this.value === v
    },
    select () {
      this.$emit('change', this.value)
      this.open = false
    }
  }
}
</script>
