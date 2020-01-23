<template>
  <div>
    <h2>{{ content.headline | capitalize }}</h2>
    <div class="t-flex t-flex-wrap">
      <div class="lg:t-w-1/3">{{ content.description }}</div>
      <div class="t-flex t-justify-between t-mb-2">
        <img :src="content.image.boys" class="t-w-1/2 t-pr-2">
        <img :src="content.image.girls" class="t-w-1/2 t-pl-2">
      </div>
    </div>
    <div v-for="table in tables" :key="table">
      <size-table :content="content[table]" />
    </div>
  </div>
</template>

<script>
import SizeTable from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/SizeTable'

export default {
  name: 'ServiceSizeLayout',
  components: {
    SizeTable
  },
  props: {
    content: {
      required: true,
      type: Object
    }
  },
  computed: {
    tables () {
      return Object.keys(this.content).filter(el => el.includes('table'))
    }
  }
}
</script>
