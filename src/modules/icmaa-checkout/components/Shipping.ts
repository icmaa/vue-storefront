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
  mounted () {

  }
}
