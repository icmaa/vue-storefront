<template>
  <div
    v-outside="outsideClick"
    class="t-relative"
  >
    <div
      class="t-cursor-pointer"
      @click="toggle"
    >
      <slot />
    </div>
    <div
      v-show="open"
      class="t-absolute t-top-full t-z-1 t-flex t-flex-wrap t-rounded-sm t-border t-border-base-light t-bg-white t-shadow"
      :class="[`t-${position}-0`, ...dropdownClassObject]"
    >
      <label
        v-for="(o, i) in filteredOptions"
        :key="'option-' + i + '-' + o.value"
        class="t-flex t-w-full t-cursor-pointer t-border-base-lighter t-px-3 t-py-2 t-text-left t-text-sm hover:t-bg-base-lightest hover:t-text-primary"
        :class="[{ 't-bg-base-lighter t-text-primary': isCurrent(o.value) }, { 't-border-b': isLast(i) }]"
      >
        {{ o.label }}
        <input
          v-model="value"
          type="radio"
          :name="name"
          :value="o.value"
          :selected="o.selected"
          class="t-hidden"
          @change="select"
        >
      </label>
    </div>
  </div>
</template>

<script>
import outsideClickMixin from 'theme/mixins/outsideClickMixin'

export default {
  mixins: [ outsideClickMixin ],
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
    },
    dropdownClass: {
      type: [String, Array, Object],
      default: ''
    },
    position: {
      type: String,
      default: 'left',
      validation: (v) => ['left', 'right'].includes(v)
    }
  },
  data () {
    return {
      value: this.current,
      open: false
    }
  },
  computed: {
    filteredOptions () {
      const options = this.hideSelected ? this.options.filter(o => !this.isCurrent(o.value)) : this.options
      return options.map(o => {
        o.selected = this.isCurrent(o.value)
        return o
      })
    },
    dropdownClassObject () {
      let v = this.dropdownClass
      if (['string', 'object'].includes(typeof v)) {
        v = [v]
      }

      return v
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
    },
    isCurrent (v) {
      return this.current === v
    },
    select () {
      this.$emit('change', this.value)
      this.open = false
    },
    isLast (i) {
      return i !== this.filteredOptions.length - 1
    },
    outsideClick () {
      this.open = false
    }
  }
}
</script>
