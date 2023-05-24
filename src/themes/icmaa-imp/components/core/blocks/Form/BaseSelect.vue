<template>
  <div class="base-select">
    <base-label
      v-if="hasLabel && !isFloating"
      :id="id"
      :class="{ 't-sr-only': hideLabel }"
    >
      <slot>
        {{ label }}
      </slot>
    </base-label>
    <div
      class="t-relative"
      :class="{ 'floating-label': isFloating }"
    >
      <select
        :id="id"
        :ref="name"
        class="focus:outline-none focus:ring t-w-full t-cursor-pointer t-appearance-none t-rounded-sm t-border t-bg-white t-text-sm t-leading-tight"
        :class="[
          sizeClasses,
          invalid ? 't-border-alert' : 't-border-base-light',
          {
            't-text-base-light': (!value && value !== 0) || value === selected,
            [selectClass]: selectClass !== false,
            'value-selected': isFloating && (value || value === 0)
          }
        ]"
        :name="name"
        :disabled="disabled"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        @change="$emit('change', $event.target.value)"
        @input="$emit('input', $event.target.value)"
      >
        <option
          v-if="selected === ''"
          disabled
          :selected="!value"
          value=""
          v-html="isFloating ? '' : initialOptionText"
        />
        <option
          v-for="(option, key) in options"
          :key="key"
          :value="option.value"
          v-bind="{ selected: option.value === selected || option.value === value }"
        >
          {{ option.label }}
        </option>
      </select>
      <floating-label
        v-if="hasLabel && isFloating"
        :id="id || name"
        class="t-pointer-events-none"
      >
        <slot>
          {{ label || initialOptionText }}
        </slot>
      </floating-label>
      <div
        class="t-pointer-events-none t-absolute t-inset-y-0 t-right-0 t-flex t-items-center"
        :class="[ size === 'sm' ? 't-px-1' : 't-px-2' ]"
      >
        <material-icon icon="keyboard_arrow_down" />
      </div>
      <loader-background
        v-if="loading"
        class="t-bottom-0"
      />
    </div>
    <ValidationMessages
      v-if="invalid"
      :validations="validations"
    />
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import InputMixin from 'theme/mixins/form/InputMixin'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import LoaderBackground from 'theme/components/core/LoaderBackground'

export default {
  name: 'BaseSelect',
  components: {
    MaterialIcon,
    LoaderBackground
  },
  mixins: [ InputMixin ],
  props: {
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
      return this.$slots.default || this.label || this.initialOptionText
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
