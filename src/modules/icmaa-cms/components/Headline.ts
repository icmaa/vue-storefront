import Vue from 'vue'

export default Vue.component('anchored-heading', {
  props: {
    level: {
      type: Number,
      required: true
    }
  },
  render: function (createElement) {
    return createElement(
      'h' + this.level,
      this.$slots.default
    )
  }
})
