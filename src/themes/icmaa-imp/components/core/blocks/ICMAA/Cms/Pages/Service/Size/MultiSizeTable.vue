<template>
  <div class="t-mb-4">
    <table class="t-w-full t-text-xs">
      <thead />
      <tbody>
        <tr v-for="row in data" :key="row" class="t-text-center t-border-b t-border-base-lighter">
          <td v-for="(col, index) in content[row]" :key="index">
            {{ col }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'ServiceShoeSizeTable',
  props: {
    content: {
      required: true,
      type: Object
    }
  },
  computed: {
    data () {
      return Object.keys(this.content).filter(el => el.includes('row'))
    }
  }
}
</script>
