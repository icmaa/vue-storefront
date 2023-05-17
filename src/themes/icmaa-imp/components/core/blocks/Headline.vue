<script lang="ts">
export default {
  name: 'Headline',
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
}
</script>
