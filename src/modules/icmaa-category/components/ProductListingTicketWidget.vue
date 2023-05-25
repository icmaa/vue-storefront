<template>
  <div
    data-test-id="ProductListingTicketWidget"
    class="product-listing t-flex t-flex-wrap t-justify-start lg:t--mx-2"
    :class="[ appearance ] "
  >
    <div
      v-for="(ticket, i) in sortedTickets"
      :key="i"
      class="t-mb-8 t-w-1/2 t-px-1 lg:t-w-1/4 lg:t-px-2"
      data-test-id="Tickets"
    >
      <router-link
        :to="getCategoryRoute(ticket.category)"
        :title="ticket.category.name"
        class="t-mb-4 t-block"
      >
        <PictureComponent
          :alt="ticket.category.name | stripHTML"
          :src="ticket.poster"
          :width="263"
          :height="370"
          :placeholder="true"
          :sizes="sizes"
          ratio="1:1"
          class="t-w-full"
        />
      </router-link>
      <router-link
        :to="getCategoryRoute(ticket.category)"
        :title="ticket.category.name"
        class="t-block t-text-sm t-leading-tight t-text-primary"
      >
        {{ ticket.category.name }}
        <ButtonComponent
          type="primary"
          size="sm"
          class="t-mt-2"
        >
          {{ $t('Buy tickets') }}
        </ButtonComponent>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import { getCurrentStoreviewDatetime } from 'icmaa-config/helpers/datetime'
import registerGenericCmsStateModule from 'icmaa-cms/helpers/genericStateModule'
import orderBy from 'lodash-es/orderBy'

import PictureComponent from 'theme/components/core/blocks/Picture'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'ProductListingTicketWidget',
  components: {
    PictureComponent,
    ButtonComponent
  },
  props: {
    columns: {
      type: [Number, String],
      default: 4
    },
    categoryId: {
      type: Number,
      required: true
    },
    sort: {
      type: String,
      default: 'online:desc'
    },
    appearance: {
      type: String,
      default: 't-px-3 lg:t-px-4'
    }
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
    sortedTickets () {
      return orderBy(this.tickets, ['firstDate', 'category.name'], ['asc', 'asc'])
    },
    categoryUrlKeys () {
      return this.rawTickets.map(t => t.categoryUrlKey)
    },
    sizes () {
      return [
        // Order high-to-low is important
        { media: 'xl', width: 263 },
        { media: 'lg', width: 236 },
        { media: 'md', width: 364 },
        { media: 'xs', width: 300 },
        { width: 220 }
      ]
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
  },
  methods: {
    getCategoryRoute (category) {
      return formatCategoryLink(category)
    }
  }
}
</script>
