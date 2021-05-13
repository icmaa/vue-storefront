// @ts-ignore
import ValidationMessages from 'theme/components/core/blocks/Form/ValidationMessages'
// @ts-ignore
import BaseLabel from 'theme/components/core/blocks/Form/BaseLabel'
// @ts-ignore
import FloatingLabel from 'theme/components/core/blocks/Form/FloatingLabel'

export default {
  components: {
    ValidationMessages,
    BaseLabel,
    FloatingLabel
  },
  props: {
    label: {
      type: [String, Boolean],
      default: false
    },
    floatingLabel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasLabel () {
      return this.$slots.default || this.label || this.placeholder
    },
    isFloating () {
      return this.floatingLabel || !(this.$slots.default || this.label)
    }
  },
  methods: {
    setFocus () {
      this.$refs[this.name].focus()
    }
  }
}
