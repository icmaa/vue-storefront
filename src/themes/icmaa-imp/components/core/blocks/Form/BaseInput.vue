<template>
  <div :class="{ 't-relative': validationsAsTooltip }">
    <base-label
      v-if="hasLabel && !isFloating"
      :id="id || name"
      :class="{ 't-sr-only': hideLabel }"
    >
      <slot>
        {{ label || placeholder }}
      </slot>
    </base-label>
    <div
      class="base-input t-relative t-flex t-flex-wrap"
      :class="{ 'floating-label': isFloating }"
    >
      <material-icon
        v-if="passIconActive"
        :icon="passTypeIcon"
        class="t-absolute t-flex t-cursor-pointer t-self-center t-p-2 t-text-base-lighter"
        :class="[`t-${iconPosition}-0`]"
        :aria-label="$t('Toggle password visibility')"
        :title="$t('Toggle password visibility')"
        @click.native="togglePassType()"
      />
      <input
        :id="id || null"
        :ref="name"
        v-mask="maskSettings"
        class="t-leading-tigh t-h-10 t-w-full t-appearance-none t-rounded-sm t-border t-px-3 t-text-sm placeholder:t-text-base-light"
        :class="[
          invalid ? 't-border-alert' : 't-border-base-light',
          {
            't-pr-10': type === 'password' || (icon && iconPosition === 'right'),
            't-pl-10': icon && iconPosition === 'left'
          }
        ]"
        :placeholder="placeholder"
        :type="type === 'password' ? passType : type"
        :name="name || null"
        :autocomplete="autocomplete"
        :value="value"
        :autofocus="autofocus"
        :disabled="disabled"
        :maxlength="maxLength"
        @input="$emit('input', $event.target.value)"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        @keyup.enter="$emit('keyup.enter', $event.target.value)"
        @keyup="$emit('keyup', $event)"
      >
      <floating-label
        v-if="hasLabel && isFloating"
        :id="id || name"
        @click.prevent="setFocus"
      >
        <slot>
          {{ label || placeholder }}
        </slot>
      </floating-label>
      <material-icon
        v-if="icon"
        :icon="icon"
        class="t-absolute t-flex t-self-center t-p-2"
        :class="[`t-${iconPosition}-0`]"
      />
    </div>
    <validation-messages
      :validations="validations"
      :validations-as-tooltip="validationsAsTooltip"
    />
  </div>
</template>

<script>
import InputMixin from 'theme/mixins/form/InputMixin'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import { mask as maskDirective } from 'vue-the-mask'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  name: 'BaseInput',
  components: {
    MaterialIcon
  },
  directives: {
    /**
     * This our way to make this directive conditional
     * https://github.com/vuejs-tips/vue-the-mask/issues/54
     */
    'mask': function (e, b) {
      if (!b.value) {
        return
      }
      maskDirective(e, b)
    }
  },
  mixins: [ InputMixin ],
  props: {
    type: {
      type: String,
      default: 'text'
    },
    autocomplete: {
      type: String,
      required: false,
      default: ''
    },
    focus: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
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
    },
    icon: {
      type: [Boolean, String],
      default: false
    },
    iconPosition: {
      type: String,
      default: 'right',
      validations: (v) => ['left', 'right'].includes(v)
    },
    mask: {
      type: [String, Object, Boolean],
      default: false
    },
    maxLength: {
      type: [Number, String, Boolean],
      default: false
    }
  },
  data () {
    return {
      passType: 'password',
      passTypeIcon: 'visibility_off',
      passIconActive: false
    }
  },
  computed: {
    invalid () {
      return this.validations.filter(v => v.condition).length > 0
    },
    maskSettings () {
      if (this.mask === 'date') {
        return currentStoreView().i18n.dateFormat.replace(/([DMY])/gm, '#')
      }
      return this.mask
    }
  },
  created () {
    if (this.type === 'password') {
      this.passIconActive = true
    }
  },
  mounted () {
    if (this.focus) {
      this.setFocus()
    }
  },
  methods: {
    togglePassType () {
      if (this.passType === 'password') {
        this.passType = 'text'
        this.passTypeIcon = 'visibility'
      } else {
        this.passType = 'password'
        this.passTypeIcon = 'visibility_off'
      }
    }
  }
}
</script>
