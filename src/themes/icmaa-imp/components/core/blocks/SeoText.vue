<template>
  <div class="t-my-8 t-container t-px-4">
    <vue-markdown :source="content" />
  </div>
</template>

<script>
import config from 'config'
import { mapGetters } from 'vuex'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'SeoText',
  components: {
    VueMarkdown
  },
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      dataType: 'markdown'
    }
  }
}
</script>
