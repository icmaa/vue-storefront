<template>
  <div class="t-container">
    <div class="t-p-4 t--mx-2 t-flex t-flex-wrap">
      <div v-for="(ticket, i) in tickets" :key="i" class="t-w-1/2 lg:t-w-1/4 t-px-2">
        <router-link :to="getCategoryRoute(ticket.category)" :title="ticket.category.name">
          <retina-image :image="getImageUrl(ticket.poster)" :alt="ticket.category.name" :placeholder="true" ratio="263:370" />
          {{ ticket.category.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import { getCurrentStoreviewDatetime } from 'icmaa-config/helpers/datetime'
import registerGenericCmsStateModule from 'icmaa-cms/helpers/genericStateModule'
import RetinaImage from 'theme/components/core/blocks/RetinaImage'

export default {
  name: 'Tickets',
  components: {
    RetinaImage
  },
  computed: {
    ...mapGetters({
      rawTickets: 'icmaaCmsTickets/getAll',
      getCategories: 'category-next/getCategories'
    }),
    tickets () {
      return this.rawTickets.map(t => {
        const category = this.getCategories.find(c => t.categoryUrlKey === c.url_key)
        if (category) {
          t = Object.assign(t, { category })
        }

        return t
      }).filter(t => t.hasOwnProperty('category'))
    },
    categoryUrlKeys () {
      return this.rawTickets.map(t => t.categoryUrlKey)
    }
  },
  methods: {
    getImageUrl (image) {
      return getThumbnailPath('/' + image, 0, 0, 'media')
    },
    getCategoryRoute (category) {
      return formatCategoryLink(category)
    }
  },
  beforeCreate () {
    registerGenericCmsStateModule('tickets', 'tickets')
  },
  async created () {
    await this.$store.dispatch('icmaaCmsTickets/list', {
      show_from: { 'lt-date': getCurrentStoreviewDatetime() },
      show_to: { 'gt-date': getCurrentStoreviewDatetime() }
    })

    await this.$store.dispatch('category-next/loadCategories', {
      onlyActive: true,
      filters: {
        url_key: this.categoryUrlKeys
      }
    })
  }
}
</script>
