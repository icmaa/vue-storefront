<template>
  <div>
    <h2>{{ content.headline | capitalize }}</h2>
    <p>{{ content.description }}</p>
    <div class="t-w-full t-flex t-flex-wrap t-justify-center">
      <div v-for="(table, index) in tables" :key="table" class="t-bg-white t-mr-2 t-mb-2 t-p-1">
        <img :src="content[table].icon" @click="show=index" class="t-opacity-25" :class="{ 't-opacity-100': show == index }">
      </div>
    </div>
    <div v-for="(table, index) in tables" :key="table">
      <shoe-size-table v-show="show==index" :content="content[table]"/>
    </div>
  </div>
</template>

<script>
import ShoeSizeTable from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/ShoeSizeTable'

export default {
  name: 'ServiceShoeSizeLayout',
  components: {
    ShoeSizeTable
  },
  props: {
    content: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      show: ''
    }
  },
  computed: {
    tables () {
      return Object.keys(this.content).filter(el => el.includes('table'))
    }
  }
}
</script>
