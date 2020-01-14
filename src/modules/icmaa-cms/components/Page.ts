import { mapGetters } from 'vuex'
import { PageStateItem } from '../types/PageState'
import { stringToComponent } from '../helpers'

import YAML from 'yaml'

import CmsMetaMixin from 'icmaa-meta/mixins/cmsMeta'

export default {
  name: 'IcmaaCmsPage',
  mixins: [ CmsMetaMixin ],
  props: {
    dataType: {
      type: String,
      default: 'html'
    }
  },
  computed: {
    ...mapGetters('icmaaCmsPage', ['getPageByIdentifier']),
    identifier (): string {
      return this.$route.params.identifier
    },
    page (): PageStateItem {
      return this.getPageByIdentifier(this.identifier)
    },
    pageData (): string {
      return this.page.content
    },
    richText (): string {
      return this.page.rte
    },
    content (): any|string {
      switch (this.dataType) {
        case 'yaml':
          return YAML.parse(this.pageData)
        case 'json':
          return JSON.parse(this.pageData)
        case 'markdown':
          return this.richText
        default:
          return stringToComponent(this.pageData)
      }
    },
    isComponent (): boolean {
      return this.content.hasOwnProperty('template')
    }
  },
  async asyncData ({ store, route }) {
    await store.dispatch(
      'icmaaCmsPage/single', { value: route.params.identifier }
    )
  }
}
