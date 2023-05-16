<template>
  <JsonLd
    v-if="product.id"
    :dto="jsonld"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import { htmlDecode } from '@vue-storefront/core/filters'
import { icmaa_meta } from 'config'
import { getCurrentStoreviewDayjsDatetime, toDayjsDate } from 'icmaa-config/helpers/datetime'

import JsonLd from './JsonLdContainer'

export default {
  name: 'JsonLdTicket',
  components: {
    JsonLd
  },
  computed: {
    ...mapGetters({
      product: 'product/getCurrentProduct',
      getOptionLabel: 'attribute/getOptionLabel',
      currentRoute: 'url/getCurrentRoute'
    }),
    description () {
      return (htmlDecode(this.product.description) || '').trim()
    },
    currency () {
      const storeView = currentStoreView()
      return storeView.i18n.currencyCode
    },
    performer () {
      if (!this.product.band) return {}

      return {
        'performer': {
          '@type': 'PerformingGroup',
          'name': this.getOptionLabel({ attributeKey: 'band', optionId: this.product.band })
        }
      }
    },
    startDate () {
      const date = this.product.ticket_eventdate.replace('00:00:00', this.product.ticket_start + ':00')
      return toDayjsDate(date, 'YYYY-MM-DD HH:mm:ss')
    },
    startTime () {
      return this.startDate.format('YYYY-MM-DDTHH:mm')
    },
    endTime () {
      return this.startDate.add(3, 'hours').format('YYYY-MM-DDTHH:mm')
    },
    images () {
      if (!this.product.media_gallery) {
        return []
      }

      let images = []
      this.product.media_gallery.forEach(image => {
        images.push(
          getThumbnailPath('/catalog/product' + image.image, undefined, undefined, 'media')
        )
      })
      return images
    },
    offers () {
      const defaults = {
        '@type': 'Offer',
        'url': icmaa_meta.base_url + this.currentRoute.fullPath,
        'validFrom': getCurrentStoreviewDayjsDatetime().format('YYYY-MM-DD'),
        'priceValidUntil': getCurrentStoreviewDayjsDatetime().add(7, 'days').format('YYYY-MM-DD'),
        'priceCurrency': this.currency
      }

      if (this.product.type_id === 'configurable') {
        const offers = []
        this.product.configurable_children.forEach(p => {
          const gtin = p.gtin ? { gtin: p.gtin } : {}
          offers.push({
            ...defaults,
            ...gtin,
            'sku': p.sku,
            'price': p.price_incl_tax,
            'availability': 'https://schema.org/' + this.availability(p)
          })
        })

        if (offers.length > 0) {
          return { offers }
        }
      } else if (this.product.type_id === 'simple' && this.product.gtin) {
        defaults.gtin = this.product.gtin
      }

      return {
        offers: {
          ...defaults,
          'sku': this.product.sku,
          'price': this.product.price_incl_tax,
          'availability': 'https://schema.org/' + this.availability(this.product)
        }
      }
    },
    jsonld () {
      return {
        '@context': 'https://schema.org/',
        '@type': 'Event',
        'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
        'eventStatus': 'https://schema.org/EventScheduled',
        'name': this.product.translatedName.trim(),
        'image': this.images,
        'description': this.description,
        'startDate': this.startTime,
        'endDate': this.endTime,
        'location': {
          '@type': 'Place',
          'name': this.product.ticket_venue,
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': this.product.ticket_address,
            'addressLocality': this.product.ticket_city
            // 'addressCountry': 'US'
          }
        },
        // 'organizer': {
        //   '@type': 'Organization',
        //   'name': 'Kira and Morrison Music',
        //   'url': 'https://kiraandmorrisonmusic.com'
        // },
        ...this.performer,
        ...this.offers
      }
    }
  },
  methods: {
    availability (product) {
      let status = 'InStock'
      let qty = product.stock.qty

      if (!product.stock.is_in_stock || qty === 0) {
        status = 'OutOfStock'
      } else if (product.stock.is_in_stock && qty <= 5) {
        status = 'LimitedAvailability'
      }

      if (this.product.promo_id === '5') {
        status = 'PreOrder'
      }

      return status
    }
  }
}
</script>
