<template>
  <div class="t-bg-white t-p-2 t-rounded t-mb-2">
    <size-navigation @toggle="updateShow" :headline="content.headline" :show="show" />
    <template v-if="show">
      <div v-for="(obj, index) in filteredContent" :key="index">
        <shoe-layout :content="obj" class="t-border-t" />
      </div>
    </template>
  </div>
</template>

<script>
import ShoeLayout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/ShoeLayout'
import SizeNavigation from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/SizeNavigation'

export default {
  name: 'ServiceBlankLayout',
  components: {
    ShoeLayout,
    SizeNavigation
  },
  props: {
    content: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    updateShow (param) {
      this.show = param
    }
  },
  computed: {
    filteredContent () {
      const { headline, ...filtered } = this.content
      return filtered
    }
  }
}
</script>
