<template>
  <div>
    <label
      :for="id"
      class="t-flex t-cursor-pointer t-items-center"
    >
      <input
        :id="id"
        class="t-hidden"
        type="checkbox"
        :name="name"
        :checked="checked"
        :disabled="disabled"
        :value="inputValue"
        @keyup.enter="$emit('click')"
        @click="$emit('click')"
        @blur="$emit('blur')"
        @change="onChange"
      >
      <div
        class="t-my-2 t-mr-2 t-flex t-h-6 t-w-6 t-flex-fix t-appearance-none t-items-center t-justify-center t-rounded-sm t-border t-bg-white t-text-sm t-leading-tight"
        :class="[ checkboxClass, invalid ? 't-border-alert' : 't-border-base-light', { 't-opacity-75': disabled }, radio ? 't-rounded-full' : 't-rounded-sm' ]"
      >
        <MaterialIcon
          v-if="checked"
          icon="check"
          size="sm"
        />
      </div>
      <div
        class="checkbox-label t-text-sm t-leading-tight"
        :class="{ 't-text-alert': invalid }"
      >
        <slot />
      </div>
    </label>
    <ValidationMessages
      v-if="showValidationMessage"
      :validations="validations"
    />
  </div>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import ValidationMessages from 'theme/components/core/blocks/Form/ValidationMessages.vue'

export default {
  name: 'BaseCheckbox',
  components: {
    MaterialIcon,
    ValidationMessages
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: [Boolean, Array, String, Number],
      default: false
    },
    inputValue: {
      type: [String, Number, Boolean],
      default: true
    },
    validations: {
      type: Array,
      default: () => []
    },
    showValidationMessage: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    radio: {
      type: Boolean,
      default: false
    },
    checkboxClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    invalid () {
      return this.validations.filter(v => v.condition).length > 0
    },
    isSingleValue () {
      return !Array.isArray(this.value) || this.radio
    },
    checked () {
      if (this.isSingleValue) {
        return this.value === this.inputValue
      }

      return this.value.includes(this.inputValue)
    }
  },
  methods: {
    onChange (e) {
      if (this.isSingleValue) {
        if (this.radio && !e.target.checked) return
        this.$emit('change', e.target.checked ? this.inputValue : e.target.checked)
      } else {
        let currentValue = [...this.value]
        if (e.target.checked) {
          currentValue.push(e.target.value)
        } else {
          currentValue = currentValue.filter(item => item !== e.target.value)
        }

        this.$emit('change', currentValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/base/global_vars';

.checkbox-label {
  &::v-deep a:not([class*='t-']) {
    color: $color-primary;
    text-decoration: underline;
  }
}
</style>
