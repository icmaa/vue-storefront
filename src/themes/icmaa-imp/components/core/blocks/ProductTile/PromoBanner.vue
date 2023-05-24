<template>
  <div
    v-if="promo"
    class="t-flex t-h-6 t-items-center t-text-xxs t-uppercase t-text-white lg:t-h-8 lg:t-text-xs"
    :class="[ background, hasBackground ? ' t-px-2' : 't-font-bold t-bg-base-light' ]"
    :style="backgroundStyle"
  >
    <template v-if="!hasBackground">
      <retina-image
        :image="`/assets/catalog/promo-flags/${promo.key}.png`"
        :alt="promo.label"
        class="t-blend-hard-light"
      />
    </template>
    <template v-else>
      {{ discount || promo.label }}
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import RetinaImage from 'theme/components/core/blocks/RetinaImage'
import i18n from '@vue-storefront/i18n'

export default {
  name: 'PromoBanner',
  components: {
    RetinaImage
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      map: [
        { id: '1', key: 'exclusive', label: i18n.t('Exclusive'), background: 't-bg-exclusive' },
        { id: '2', key: 'sustainable', label: i18n.t('Sustainable'), background: 't-bg-sustainable' },
        { id: '3', key: 'onlytemporary', label: i18n.t('Only temporary'), background: 't-bg-onlytemporary' },
        { id: '5', key: 'preorder', label: i18n.t('Preorder'), background: '#611222' },
        { id: '6', key: 'special', label: i18n.t('Special'), background: 't-bg-special' },
        { id: '7', key: 'purenoise', label: 'Pure Noise', background: null },
        { id: '8', key: 'continental', label: 'Continental', background: null },
        { id: '9', key: 'limited', label: i18n.t('Limited'), background: 't-bg-limited' },
        { id: '', key: 'sale', label: i18n.t('Sale'), background: 't-bg-sale' },
        { id: '', key: 'new', label: i18n.t('New'), background: 't-bg-new' }
      ]
    }
  },
  computed: {
    promoId () {
      return this.product.promo_id
    },
    promo () {
      if (this.promoId === '') {
        return false
      }

      if (this.product.special_price && parseFloat(this.product.special_price) > 0) {
        return this.map.find(v => v.key === 'sale')
      }

      const newRange = dayjs(this.product.online).isAfter(dayjs().subtract(30, 'days'))
      const isNew = newRange ? this.map.find(v => v.key === 'new') : undefined

      return this.map.find(v => v.id === this.promoId) || isNew || false
    },
    discount () {
      const original = this.product.original_price_incl_tax
      const special = this.product.price_incl_tax
      if (this.promo.key === 'sale' && special < original) {
        return '–' + (100 - parseInt(special * 100 / original)) + '%'
      }

      return false
    },
    isBackgroundHexColor () {
      let { background } = this.promo
      return background && background.startsWith('#')
    },
    hasBackground () {
      return this.background || this.backgroundStyle
    },
    background () {
      let { background } = this.promo
      return !this.isBackgroundHexColor ? background : false
    },
    backgroundStyle () {
      let { background } = this.promo
      return this.isBackgroundHexColor ? { background } : false
    }
  }
}
</script>
