<template>
  <div>
    <h2>Merchandise Blanks</h2>
    <div v-for="(obj, index) in content" :key="index">
      <shoe-layout :content="obj" />
    </div>
  </div>
</template>

<script>
import ShoeLayout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/ShoeLayout'

export default {
  name: 'ServiceBlankLayout',
  components: {
    ShoeLayout
  },
  props: {
    content: {
      required: true,
      type: Object
    }
  },
  computed: {
  }
}
</script>
