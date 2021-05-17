
export default {
  name: 'Addresses',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    submit () {
      this.$store.dispatch('checkout/activateSection', 'shipping')
    }
  }
}
