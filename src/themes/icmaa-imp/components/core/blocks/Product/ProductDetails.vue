<template>
  <div class="t-text-sm">
    <div
      class="description t-whitespace-pre-line"
      v-text="stripHTML(description)"
    />
    <ul
      v-if="commonphrases"
      class="commonphrases"
    >
      <li
        v-for="(phrase, i) in commonphrases"
        :key="i"
        class="t-mt-2"
      >
        <span
          v-if="i === 0"
          class="t-mr-1 t-font-bold"
        >{{ $t('Notice:') }}</span>
        {{ phrase }}
      </li>
    </ul>
    <model
      :product="product"
      class="t-mt-2"
    />
    <no-ssr>
      <ul
        v-if="attributes.length > 0"
        class="attributes t-mt-6"
      >
        <product-attributes
          v-for="(attr, i) in attributes"
          :key="'product-attribute-' + attr.attribute_code + '-' + i"
          :product="product"
          :attribute="attr"
          class="t-mb-3"
        />
      </ul>
    </no-ssr>
    <div
      v-if="blank"
      class="blank t-mt-6"
    >
      <span class="t-mb-2 t-block t-font-bold">{{ blank.label }}</span>
      <img
        :src="blank.image"
        :srcset="`${blank.image} 1x, ${blank.imageAt2x} 2x`"
        :alt="blank.label + ' - ' + blank.optionLabel"
        width="100"
        height="50"
      >
    </div>
    <div
      v-if="departmentAdvice"
      class="department-advice t-mt-8 t-text-base-lighter"
    >
      <material-icon
        icon="asterisk"
        icon-set="icmaa"
        size="icon"
      /> {{ $t('This is a merch product of the above-named band. We want to point out that the article description is a paraphrasing specification in consideration of the imprinted motif.') }}
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
  components: {
    Model,
    ProductAttributes,
    MaterialIcon,
    'no-ssr': NoSSR
  },
  props: {
    product: {
      type: Object,
      required: true
    }
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
