<template>
  <script
    type="application/ld+json"
    v-html="jsonld"
  />
</template>

<script>
export default {
  name: 'JsonLdContainer',
  props: {
    dto: {
      type: Object,
      required: true
    }
  },
  computed: {
    jsonld () {
      return JSON.stringify(this.dto)
    }
  }
}
</script>
