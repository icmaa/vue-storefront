import Asset from 'icmaa-cms/components/Storyblok/Asset.vue'
import { toDate } from 'icmaa-config/helpers/datetime'

export default {
  components: {
    Asset
  },
  filters: {
    date (d) {
      return toDate(d, undefined, undefined)
    },
    tag (tag) {
      return `#${tag}`
    }
  }
}
