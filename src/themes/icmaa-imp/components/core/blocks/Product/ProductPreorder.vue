<template>
  <div class="t--mb-8 t--mx-8 t-bg-alt-3 t-flex t-py-2">
    <material-icon icon="access_time" size="xl" class="t-ml-8 t-mr-2" />
    <div class="description t-whitespace-pre-line" v-if="isPreorder" v-text="preorderText" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { stripHTML } from '@vue-storefront/core/filters/strip-html'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'
import { toDayjsDate } from 'icmaa-config/helpers/datetime'
import i18n from '@vue-storefront/i18n'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    MaterialIcon
  },
  computed: {
    isPreorder () {
      return this.product.promo_id === '5'
    },
    preorderText () {
      return i18n.t('Delivery of your complete order not before {date}. The preorder date is the release date for Germany, as we were told by the record label or distributor. There is no guarantee for a delivery on that date. In exceptional cases, especially for imported products, there might be delays. As soon as we receive the article, we will ship it.', { date: this.mediaReleaseDate })
    },
    mediaReleaseDate () {
      return toDayjsDate(this.product.media_release)
        .format('YYYY-MM-DD')
    }
  }
}
</script>
