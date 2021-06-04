<template>
  <div>
    <div
      v-for="(segment, index) in filteredTotals"
      :key="`total-${index}`"
      class="t-flex t-items-end t-justify-between t-mb-2 t-text-sm"
    >
      <span>
        {{ segment.title }}
      </span>
      <span v-if="segment.value !== null" class="t-flex-fix">
        {{ segment.value_incl_tax || segment.value | price }}
      </span>
    </div>
    <div
      v-for="(segment, index) in grandTotals"
      :key="`grand-total-${index}`"
      class="t-flex t-items-end t-justify-between t-font-bold"
    >
      <span>
        {{ segment.title }}
      </span>
      <span class="t-flex-fix">
        {{ segment.value | price }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MicroCartTotals',
  props: {
    rows: {
      type: Array,
      default: () => [ 'subtotal', 'tax', 'shipping', 'cashondelivery' ]
    }
  },
  computed: {
    ...mapGetters({
      totals: 'cart/getTotals'
    }),
    filteredTotals () {
      const totals = this.totals
      return totals
        .filter(segment => this.rows.includes(segment.code))
        .sort((a, b) => this.rows.findIndex(c => c === a.code) - this.rows.findIndex(c => c === b.code))
    },
    grandTotals () {
      const totals = this.totals
      return totals.filter(segment => segment.code === 'grand_total')
    }
  }
}
</script>
