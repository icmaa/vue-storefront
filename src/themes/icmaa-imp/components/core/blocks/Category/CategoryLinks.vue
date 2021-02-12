<template>
  <div class="presets">
    <button-component v-for="c in categories" :key="'filter-' + c.slug" size="sm" class="t-ml-2 t-opacity-75 hover:t-opacity-100" @click="$router.push(c.url_path)">
      {{ c.label }}
    </button-component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'CategoryLinks',
  components: {
    ButtonComponent
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  }
}
</script>
