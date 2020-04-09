<template>
  <div class="t-my-8 t-container t-px-4" v-html="content" />
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'

export default {
  name: 'SeoText',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: true
    }
  }
}
</script>
