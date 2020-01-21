<template>
  <div class="t-mb-4">
    <h3>{{ content.headline | capitalize }}</h3>
    <table class="t-w-full t-text-xs">
      <thead />
      <tbody>
        <tr v-for="row in rows" :key="row">
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
    }
  },
  computed: {
    rows () {
      return Object.keys(this.content).filter(el => el !== 'headline')
    }
  }
}
</script>
