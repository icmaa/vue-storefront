<template>
  <router-link
    :to="productLink"
    tag="li"
    class="t-flex t-cursor-pointer t-flex-wrap t-bg-white t-px-2 t-py-4"
  >
    <div class="t-w-full t-grow t-px-2 md:t-w-7/12">
      <div class="t-mb-2 t-leading-tight t-text-primary md:t-mb-0 md:t-leading-normal">
        {{ product.translatedName }}
      </div>
      <div class="t-text-sm">
        <span v-text="product.ticket_city" />
        <span
          v-if="product.ticket_venue && product.ticket_venue.length > 0"
          class="t-uppercase"
          v-text="`@ ${product.ticket_venue}`"
        />
      </div>
    </div>
    <div class="t-mb-2 t-flex t-w-full t-items-baseline t-px-2 t-text-sm md:t-mb-0 md:t-block md:t-w-2/12 md:t-text-base">
      <div
        class="t-mr-2"
        v-text="ticketEventdate"
      />
      <div
        class="md:t-text-sm"
        v-text="product.ticket_start"
      />
    </div>
    <div class="t-flex t-w-full t-px-2 md:t-block md:t-w-2/12">
      <div class="md:t-order-0 t-order-2 t-grow t-text-right md:t-text-left">
        <span
          v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0"
          class="price-original t-mr-2 t-text-base-light t-line-through"
        >
          {{ price(product.original_price_incl_tax) }}
        </span>
        <span
          v-if="product.special_price && parseFloat(product.special_price) > 0"
          class="price-special t-font-bold t-text-sale"
        >
          <span
            v-if="hasMultiplePrices"
            v-text="$t('as low as')"
          />
          {{ price(product.price_incl_tax) }}
        </span>
        <span
          v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0"
          class="price t-font-bold t-text-base-dark"
        >
          <span
            v-if="hasMultiplePrices"
            v-text="$t('as low as')"
          />
          {{ price(product.price_incl_tax) }}
        </span>
      </div>
      <ProductAvailability
        :product="product"
        class="md:t-order-0 t-order-1"
      />
    </div>
    <div class="t-hidden t-flex-1 t-self-center t-px-2 md:t-block md:t-w-1/12">
      <ButtonComponent
        type="transparent"
        icon="keyboard_arrow_right"
        :icon-only="true"
      >
        {{ $t('Show product') }}
      </ButtonComponent>
    </div>
  </router-link>
</template>

<script>
import ProductAvailability from 'theme/components/core/blocks/Product/ProductAvailability'
import ButtonComponent from 'theme/components/core/blocks/Button'
import ProductTileMixin from 'theme/mixins/product/tileMixin'
import ProductPriceMixin from 'theme/mixins/product/priceMixin'
import { toDate } from 'icmaa-config/helpers/datetime'

export default {
  name: 'ProductTicketTile',
  components: {
    ProductAvailability,
    ButtonComponent
  },
  mixins: [ProductTileMixin, ProductPriceMixin],
  computed: {
    ticketEventdate () {
      return toDate(this.product.ticket_eventdate)
    }
  }
}
</script>
