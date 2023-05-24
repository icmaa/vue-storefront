<template>
  <div class="t-mb-4">
    <div
      v-if="headline"
      class="t-mb-4 t-font-bold"
    >
      {{ table.headline }}
    </div>
    <table class="t-w-full t-table-auto t-text-xs">
      <thead />
      <tbody>
        <tr
          v-for="rowKey in tableRowKeys"
          :key="rowKey"
          class="t-border-b t-border-base-lighter"
        >
          <td
            v-for="(value, key) in table[rowKey]"
            :key="key"
            class="t-border t-border-base-lighter t-p-1"
          >
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'ServiceSizeTable',
  props: {
    table: {
      required: true,
      type: Object
    },
    headline: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tableRowKeys () {
      return Object.keys(this.table).filter(el => el.includes('row'))
    }
  }
}
</script>
