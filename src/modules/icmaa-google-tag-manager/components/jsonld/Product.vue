<template>
  <JsonLd :dto="jsonld" v-if="product.id" />
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { getThumbnailPath } from '@vue-storefront/core/helpers'
import { icmaa_meta } from 'config'
import { getCurrentStoreviewDayjsDatetime } from 'icmaa-config/helpers/datetime'
import { getProductChildQtyByType } from 'icmaa-catalog/helpers'

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
      currentRoute: 'url/getCurrentRoute'
    }),
    description () {
      return (this.product.description || '').trim()
    },
    currency () {
      const storeView = currentStoreView()
      return storeView.i18n.currencyCode
    },
    gtin () {
      if (this.product.type_id === 'configurable') {
        const curOpt = this.product.configurable_children.find(p => p.sku === this.product.sku)
        if (!curOpt?.gtin) return {}
        return { gtin: curOpt.gtin }
      }

      if (!this.product?.gtin) return {}
      return { gtin: this.product.gtin }
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
    price () {
      return this.product.price_incl_tax
    },
    productChildQty () {
      return getProductChildQtyByType(this.product)
    },
    availability () {
      let status = 'InStock'
      let qty = this.product.stock.qty + this.productChildQty

      if (!this.product.stock.is_in_stock || qty === 0) {
        status = 'OutOfStock'
      } else if (this.product.stock.is_in_stock && qty <= 5) {
        status = 'LimitedAvailability'
      }

      if (this.product.promo_id === '5') {
        status = 'PreOrder'
      } else if (this.isEndOfSale) {
        status = 'OutOfStock'
      }

      return status
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

      if (count === 0) return {}

      return {
        'aggregateRating': {
          '@type': 'AggregateRating',
          ratingValue: 5 * percent / 100,
          reviewCount: Number(count)
        },
        'review': {
          '@type': 'Review',
          'reviewRating': {
            '@type': 'Rating',
            'ratingValue': 5 * percent / 100,
            'bestRating': '5'
          },
          'author': {
            '@type': 'Organization',
            'name': 'IC Music and Apperal GmbH'
          }
        }
      }
    },
    jsonld () {
      return {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': this.product.name.trim(),
        'image': this.images,
        'description': this.description,
        'sku': this.product.parentSku || this.product.sku,
        ...this.gtin,
        ...this.brand,
        ...this.rating,
        'offers': {
          '@type': 'Offer',
          'url': icmaa_meta.base_url + this.currentRoute.fullPath,
          'priceCurrency': this.currency,
          'price': this.price,
          'priceValidUntil': getCurrentStoreviewDayjsDatetime().add(7, 'days').format('YYYY-MM-DD'),
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': 'https://schema.org/' + this.availability
        }
      }
    }
  }
}
</script>
