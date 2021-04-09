import { icmaa } from 'config'
import i18n from '@vue-storefront/i18n'

export default {
  computed: {
    genderOptions () {
      const { genderMap } = icmaa.user
      return Object.keys(genderMap)
        .map(value => ({
          label: i18n.t(value), value
        }))
    }
  }
}
