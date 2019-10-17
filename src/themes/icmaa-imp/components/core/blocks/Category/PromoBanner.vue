<template>
  <div v-if="promo" class="t-flex t-items-center t-h-6 t-text-xxs t-uppercase t-text-white t-px-2 lg:t-h-8 lg:t-text-xs" :class="{ 't-font-bold t-bg-base-light': !background }" :style="background" v-text="discount || promo.label" />
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'PromoBanner',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      map: [
        { promoId: '1', key: 'exclusive', label: 'Exclusive', background: '#B18C3E' },
        { promoId: '3', key: 'american_apparel', label: 'American Apparel', background: null },
        { promoId: '5', key: 'preorder', label: 'Preorder', background: '#611222' },
        { promoId: '6', key: 'special_offer', label: 'Special Offer', background: '#64BCAC' },
        { promoId: '7', key: 'special_offer', label: 'Special Offer', background: '#64BCAC' },
        { promoId: '8', key: 'artery', label: 'Artery', background: null },
        { promoId: '9', key: 'sumerian', label: 'Sumerian Records', background: null },
        { promoId: '10', key: 'deathwish', label: 'Deathwish', background: null },
        { promoId: '11', key: 'continental', label: 'Continental', background: null },
        { promoId: '12', key: 'purenoise', label: 'Pure Noise', background: null },
        { promoId: '13', key: 'limited', label: 'Limited', background: '#023AE1' },
        { promoId: '14', key: 'backprint', label: 'Backprint', background: '#551D99' },
        { promoId: '', key: 'sale', label: 'Sale', background: '#006EA1' },
        { promoId: '', key: 'new', label: 'New', background: '#1AC759' }
      ]
    }
  },
  computed: {
    promoId () {
      return this.product.promo_id
    },
    promo () {
      if (this.product.special_price && parseFloat(this.product.special_price) > 0) {
        return this.map.find(v => v.key === 'sale')
      }

      let isNew = dayjs(this.product.online).isAfter(dayjs().subtract(14, 'days')) ? this.map.find(v => v.key === 'new') : undefined

      return this.map.find(v => v.promoId === this.promoId) || isNew || false
    },
    discount () {
      const original = this.product.original_price_incl_tax
      const special = this.product.price_incl_tax
      if (this.promo.key === 'sale' && special < original) {
        return '–' + (100 - parseInt(special * 100 / original)) + '%'
      }

      return false
    },
    background () {
      let { background } = this.promo
      return background.startsWith('#') ? { background } : null
    }
  }
}
</script>
