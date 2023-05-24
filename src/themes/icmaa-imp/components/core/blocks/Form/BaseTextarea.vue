<template>
  <div class="base-textarea">
    <base-label
      v-if="hasLabel && !isFloating"
      :id="id"
      :class="{ 't-sr-only': hideLabel }"
    >
      <slot>
        {{ label || placeholder }}
      </slot>
    </base-label>
    <div
      class="t-relative"
      :class="{ 'floating-label': isFloating }"
    >
      <textarea
        :id="id"
        :ref="name"
        class="t-h-40 t-w-full t-appearance-none t-rounded-sm t-border t-px-3 t-py-2 t-text-sm placeholder:t-text-base-light"
        :class="[ invalid ? 't-border-alert' : 't-border-base-light' ]"
        :placeholder="placeholder"
        :name="name"
        :autocomplete="autocomplete"
        :value="value"
        :autofocus="autofocus"
        @input="$emit('input', $event.target.value)"
        @blur="$emit('blur')"
        @keyup.enter="$emit('keyup.enter', $event.target.value)"
        @keyup="$emit('keyup', $event)"
      />
      <floating-label
        v-if="hasLabel && isFloating"
        :id="id || name"
        @click.prevent="setFocus"
      >
        <slot>
          {{ label || placeholder }}
        </slot>
      </floating-label>
      <ValidationMessages
        v-if="invalid"
        :validations="validations"
        :validations-as-tooltip="validationsAsTooltip"
      />
    </div>
  </div>
</template>

<script>
import InputMixin from 'theme/mixins/form/InputMixin'

export default {
  name: 'BaseTextarea',
  mixins: [ InputMixin ],
  props: {
    autocomplete: {
      type: String,
      required: false,
      default: ''
    },
    focus: {
      type: Boolean,
      required: false,
      default: false
    },
    autofocus: {
      type: Boolean,
      required: false,
      default: false
    },
    validations: {
      type: Array,
      default: () => []
    },
    validationsAsTooltip: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      iconActive: false,
      icon: 'visibility'
    }
  },
  computed: {
    invalid () {
      return this.validations.filter(v => v.condition).length > 0
    }
  },
  mounted () {
    if (this.focus) {
      this.setFocus()
    }
  }
}
</script>
