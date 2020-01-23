<template>
  <div>
    <h2>{{ content.headline | capitalize }}</h2>
    <div class="t-flex t-flex-wrap t-mb-4">
      <div class="t-w-1/2" v-if="content.description">
        {{ content.description }}
      </div>
      <img class="t-w-1/2" v-if="content.icon" :src="content.icon">
    </div>
    <div class="t-w-full t-flex t-flex-wrap t-justify-center">
      <div v-for="(table, index) in tables" :key="table" class="t-bg-white t-mr-2 t-mb-2 t-p-1">
        <img :src="content[table].icon" @click="show=index" class="t-opacity-25 t-cursor-pointer" :class="{ 't-opacity-100': show == index }">
      </div>
    </div>
    <div v-for="(table, index) in tables" :key="table">
      <size-table v-show="show==index" :content="content[table]" />
    </div>
  </div>
</template>

<script>
import SizeTable from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/SizeTable'

export default {
  name: 'ServiceShoeLayout',
  components: {
    SizeTable
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
