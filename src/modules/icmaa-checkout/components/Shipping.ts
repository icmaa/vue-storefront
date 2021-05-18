import { mapGetters } from 'vuex'

export default {
  name: 'Shipping',
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
    ...mapGetters({
    })
  },
  methods: {
    submit () {
      this.$store.dispatch('cart/syncTotals', { forceServerSync: true, methodsData: 'SELECTED-METHOD' })
    }
  }
}
