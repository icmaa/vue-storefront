<template>
  <div class="base-select">
    <label v-if="hasLabel" :for="id" :class="{ 't-sr-only': hideLabel }" class="t-w-full t-flex t-self-center t-mb-1 t-px-1 t-text-base-tone t-text-sm">
      <slot>
        {{ label }}
      </slot>
    </label>
    <div class="t-relative">
      <select
        class="t-w-full t-border t-rounded-sm t-text-sm t-leading-tight t-bg-white t-appearance-none t-cursor-pointer focus:outline-none focus:shadow-outline"
        :class="[ sizeClasses, invalid ? 't-border-alert' : 't-border-base-light', { 't-text-base-light': !value || value === selected }, { [selectClass]: selectClass !== false } ]"
        :name="name"
        :id="id"
        :disabled="disabled"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        @change="$emit('change', $event.target.value)"
        @input="$emit('input', $event.target.value)"
      >
        <option disabled :selected="!value" v-if="selected === ''" value="" v-html="initialOptionText" />
        <option
          v-for="(option, key) in options"
          :key="key"
          :value="option.value"
          v-bind="{ selected: option.value === selected || option.value === value }"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="t-pointer-events-none t-absolute t-inset-y-0 t-right-0 t-flex t-items-center" :class="[ size === 'sm' ? 't-px-1' : 't-px-2' ]">
        <material-icon icon="keyboard_arrow_down" />
      </div>
      <loader-background v-if="loading" class="t-bottom-0" />
    </div>
    <ValidationMessages v-if="invalid" :validations="validations" />
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import ValidationMessages from './ValidationMessages'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import LoaderBackground from 'theme/components/core/LoaderBackground'

export default {
  name: 'BaseSelect',
  components: {
    MaterialIcon,
    LoaderBackground,
    ValidationMessages
  },
  props: {
    label: {
      type: [String, Boolean],
      default: false
    },
    hideLabel: {
      type: [Boolean],
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: String,
      required: false,
      default: ''
    },
    name: {
      type: String,
      required: false,
      default: ''
    },
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    initialOptionText: {
      type: String,
      required: false,
      default: i18n.t('Choose an option')
    },
    selected: {
      type: [String, Number],
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    validations: {
      type: Array,
      default: () => []
    },
    validationsAsTooltip: {
      type: Boolean,
      default: false
    },
    selectClass: {
      type: [Boolean, String],
      default: false
    },
    size: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'sm'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    invalid () {
      return this.validations.filter(v => v.condition).length > 0
    },
    hasLabel () {
      return this.$slots.default || this.label
    },
    sizeClasses () {
      let classes = ''
      switch (this.size) {
        case 'sm':
          classes = 't-h-8 t-pl-2 t-pr-10'
          break
        default:
          classes = 't-h-10 t-pl-3 t-pr-12'
      }

      return classes
    }
  }
}
</script>
