<template>
  <div class="t-mb-4">
    <h3 v-if="headline">
      {{ content.headline | capitalize }}
    </h3>
    <table class="t-w-full t-text-xs">
      <thead />
      <tbody>
        <tr v-for="row in data" :key="row" class="t-text-center t-border-b t-border-base-lighter">
          <td v-for="(value, key) in content[row]" :key="key">
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
    content: {
      required: true,
      type: Object
    },
    headline: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    data () {
      return Object.keys(this.content).filter(el => el.includes('row'))
    }
  }
}
</script>
