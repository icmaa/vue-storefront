<template>
  <div class="t-text-sm">
    <div class="description t-whitespace-pre-line" v-text="stripHTML(description)" />
    <ul class="commonphrases" v-if="commonphrases">
      <li v-for="(phrase, i) in commonphrases" :key="i" class="t-mt-2">
        <span class="t-font-bold t-mr-1" v-if="i === 0">{{ $t('Notice:') }}</span>
        {{ phrase }}
      </li>
    </ul>
    <model :product="product" class="t-mt-2" />
    <no-ssr>
      <ul class="attributes t-mt-6" v-if="attributes.length > 0">
        <product-attributes
          v-for="(attr, i) in attributes"
          :key="'product-attribute-' + attr.attribute_code + '-' + i"
          :product="product"
          :attribute="attr"
          class="t-mb-3"
        />
      </ul>
    </no-ssr>
    <div class="blank t-mt-6" v-if="blank">
      <span class="t-font-bold t-block t-mb-2">{{ blank.label }}</span>
      <img :src="blank.image" :srcset="`${blank.image} 1x, ${blank.imageAt2x} 2x`" :alt="blank.label + ' - ' + blank.optionLabel">
    </div>
    <div class="department-advice t-text-base-lighter t-mt-8" v-if="departmentAdvice">
      <material-icon icon="asterisk" icon-set="icmaa" size="icon" /> {{ $t('This is a merch product of the above-named band. We want to point out that the article description is a paraphrasing specification in consideration of the imprinted motif.') }}
    </div>
  </div>
</template>

<script>
import { icmaa_catalog } from 'config'
import { mapGetters } from 'vuex'
import { stripHTML } from '@vue-storefront/core/filters/strip-html'
import Model from 'theme/components/core/blocks/Product/Model'
import ProductAttributes from 'theme/components/core/blocks/Product/ProductAttributes'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import NoSSR from 'vue-no-ssr'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    Model,
    ProductAttributes,
    MaterialIcon,
    'no-ssr': NoSSR
  },
  computed: {
    ...mapGetters({
      attributesByCode: 'attribute/getAttributeListByCode',
      getAttributeLabel: 'attribute/getAttributeLabel',
      getOptionLabel: 'attribute/getOptionLabel'
    }),
    attributes () {
      return Object.values(this.attributesByCode).filter(a => {
        return a.is_visible && a.is_visible_on_front === true && this.product[a.attribute_code] && this.product[a.attribute_code][0] !== ''
      })
    },
    description () {
      return (this.product.description || '').trim()
    },
    blank () {
      const blank = this.product.rohling
      if (this.product.rohling) {
        const label = this.getAttributeLabel({ attributeKey: 'rohling' })
        const optionLabel = this.getOptionLabel({ attributeKey: 'rohling', optionId: this.product.rohling })
        const imagePath = '/assets/features/blanks/'
        const image = imagePath + optionLabel + '.png'
        const imageAt2x = imagePath + optionLabel + '@2x.png'

        return { label, optionLabel, image, imageAt2x }
      }

      return false
    },
    departmentAdvice () {
      return this.product.department === 6
    },
    commonphrases () {
      if (
        !this.product.commonphrases ||
        this.product.commonphrases.length === 0 ||
        this.product.commonphrases[0] === ''
      ) {
        return false
      }

      const importantPhrases = icmaa_catalog.entities.product.importantCommonphrases || []

      return this.product.commonphrases
        .filter(optionId => importantPhrases.includes(optionId))
        .map(optionId => this.getOptionLabel({ attributeKey: 'commonphrases', optionId }))
    }
  },
  methods: {
    stripHTML
  }
}
</script>
