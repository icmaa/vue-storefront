import { mapGetters } from 'vuex'
import { PageStateItem } from '../types/PageState'
import { stringToComponent } from '../helpers'

import CmsMetaMixin from 'icmaa-meta/mixins/cmsMeta'

export default {
  mixins: [ CmsMetaMixin ],
  computed: {
    ...mapGetters('icmaaCmsPage', ['getByIdentifier']),
    identifier (): string {
      return this.$route.params.identifier
    },
    page (): PageStateItem {
      return this.getByIdentifier(this.identifier)
    },
    pageData (): string {
      return this.page.content
    },
    content (): any|string {
      switch (this.dataType) {
        case 'yaml':
        case 'json':
          return JSON.parse(this.pageData)
        case 'markdown':
          return stringToComponent(this.page.rte)
        default:
          return stringToComponent(this.pageData)
      }
    }
  },
  async asyncData ({ context, store, route }) {
    if (context) {
      context.output.cacheTags
        .add('cms')
        .add('cms-' + route.params.identifier.toLowerCase())
    }

    await store.dispatch(
      'icmaaCmsPage/single', { value: route.params.identifier }
    )
  }
}
