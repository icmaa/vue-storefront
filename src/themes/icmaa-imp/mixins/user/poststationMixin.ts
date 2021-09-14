import { poststation } from 'icmaa-config/helpers/validators'

export default {
  props: {
    enablePoststation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      address: {
        poststation: false
      }
    }
  },
  computed: {
    isPoststation () {
      return this.address.poststation || poststation(this.address.street.join(' '))
    },
    hasPoststation () {
      return (this.enablePoststation && ['DE'].includes(this.countryId))
    }
  }
}
