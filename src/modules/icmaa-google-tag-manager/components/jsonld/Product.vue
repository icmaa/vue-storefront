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
import { getCurrentStoreviewDayjsDatetime, toDate } from 'icmaa-config/helpers/datetime'

import JsonLd from './JsonLdContainer'

export default {
  name: 'JsonLdProduct',
  components: {
    JsonLd
  },
  computed: {
    ...mapGetters({
      product: 'product/getCurrentProduct',
      getOptionLabel: 'attribute/getOptionLabel',
      currentRoute: 'url/getCurrentRoute',
      getReviews: 'review/getReviews'
    }),
    description () {
      return (htmlDecode(this.product.description) || '').trim()
    },
    currency () {
      const storeView = currentStoreView()
      return storeView.i18n.currencyCode
    },
    brand () {
      const attrKey = this.product.brand ? 'brand' : 'band'
      return {
        'brand': {
          '@type': attrKey === 'brand' ? 'Brand' : 'Organization',
          'name': this.getOptionLabel({ attributeKey: attrKey, optionId: this.product[attrKey] })
        }
      }
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
    rating () {
      const { count = 0, rating_summary: percent = 0 } = this.product.reviews

      if (parseInt(count) === 0) return {}

      return {
        'aggregateRating': {
          '@type': 'AggregateRating',
          ratingValue: 5 * percent / 100,
          ratingCount: Number(count),
          reviewCount: Number(count),
          bestRating: 5,
          worstRating: 0
        }
      }
    },
    offers () {
      const defaults = {
        '@type': 'Offer',
        'url': icmaa_meta.base_url + this.currentRoute.fullPath,
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
    reviews () {
      if (this.getReviews.length === 0) return {}

      const reviews = []
      this.getReviews.forEach(r => {
        reviews.push({
          '@type': 'Review',
          'author': {
            '@type': 'Person',
            'name': r.nickname
          },
          'datePublished': toDate(r.created_at, 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'),
          'description': r.detail.trim(),
          'reviewRating': {
            '@type': 'Rating',
            'bestRating': 100,
            'worstRating': 0,
            'ratingValue': r.ratings_total
          }
        })
      })

      return { reviews }
    },
    gtin () {
      if (this.product.type_id === 'simple' && this.product.gtin) {
        return { gtin: this.product.gtin }
      } else if (this.product.type_id === 'configurable' &&
        this.product.configurable_children.length > 0 &&
        this.product.configurable_children[0].gtin
      ) {
        return { gtin: this.product.configurable_children[0].gtin }
      }

      return {}
    },
    jsonld () {
      return {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'sku': this.product.parentSku || this.product.sku,
        'name': this.product.translatedName.trim(),
        'image': this.images,
        'description': this.description,
        ...this.gtin,
        ...this.brand,
        ...this.rating,
        'itemCondition': 'https://schema.org/NewCondition',
        ...this.offers,
        ...this.reviews
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
