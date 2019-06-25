import { mapState, mapGetters } from 'vuex'
import { isServer } from '@vue-storefront/core/helpers'
import config from 'config'

import { Logger } from '@vue-storefront/core/lib/logger';

export default {
  name: 'IcmaaCategoryList',
  computed: {
    ...mapGetters({ listByParentId: 'icmaaCategory/listByParentId' }),
    rootCategoryId (): string {
      return String(this.$route.params.parentCategoryId)
    },
    categories: function () {
      Logger.error('Lorem ipsum', 'DEBUG', this.listByParentId)()
      return {}
    }
  },
  methods: {
    fetchCategories () {
      return this.$store.dispatch('icmaaCategory/list', { parent: this.rootCategoryId })
    }
  },
  serverPrefetch () {
    return this.fetchCategories();
  }
}
