import { mapGetters } from 'vuex'
import { price } from 'icmaa-config/helpers/price'

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
      selectedMethod: false
    }
  },
  computed: {
    ...mapGetters({
      getShippingMethods: 'checkout/getShippingMethods'
    }),
    hasShippingMethod () {
      return this.getShippingMethods.length > 0
    },
    shippingMethods () {
      const methods = this.getShippingMethods
      return methods.map(method => {
        const { code, method_title: title, method_description: description, amount } = method
        return { code, title, description, amount }
      })
    }
  },
  beforeMount () {
    this.$store.dispatch('cart/syncShippingMethods', { forceServerSync: true })
  },
  methods: {
    price,
    submit () {
      this.$store.dispatch('cart/syncTotals', { forceServerSync: true, methodsData: 'SELECTED-METHOD' })
    }
  }
}
