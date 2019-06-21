export default {
  name: 'IcmaaCmsBlock',
  props: {
    identifier: {
      type: String,
      default: null,
      required: true
    },
    content: {
      type: String,
      default: null,
      required: false
    }
  },
  created () {
    this.$store.dispatch('icmaaCmsBlock/single', { value: this.identifier })
  },
  computed: {
    block () {
      return this.$store.getters['icmaaCmsBlock/blockByIdentifier'](this.identifier)
    }
  }
}
