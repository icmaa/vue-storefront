<script lang="ts">
export default {
  name: 'Headline',
  props: {
    level: {
      type: Number,
      default: 2
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
