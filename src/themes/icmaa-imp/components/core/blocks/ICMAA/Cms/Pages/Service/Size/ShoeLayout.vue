<template>
  <div class="t-bg-white t-p-2 t-rounded t-mb-2">
    <size-navigation @toggle="updateShow" :headline="content.headline" :show="show" />
    <template v-if="show">
      <div class="t-flex t-flex-wrap t-mt-2">
        <div class="t-w-1/2 t-text-sm" v-if="content.description">
          {{ content.description }}
        </div>
        <img class="t-w-1/2 lg:t-w-1/3" v-if="content.icon" :src="content.icon">
      </div>
      <div class="t-w-full t-flex t-flex-wrap t-justify-center t-mb-2">
        <div v-for="(table, index) in tables" :key="table" class="t-bg-white t-mr-2 t-mb-2 t-p-1">
          <img :src="content[table].icon" @click="selected=index" class="t-opacity-25 t-cursor-pointer t-p-1 t-border t-border-base-lighter" :class="{ 't-opacity-100': selected == index }">
        </div>
      </div>
      <div v-for="(table, index) in tables" :key="table">
        <size-table v-show="selected==index" :table="content[table]" />
      </div>
    </template>
  </div>
</template>

<script>
import SizeTable from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/SizeTable'
import SizeNavigation from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/SizeNavigation'

export default {
  name: 'ServiceShoeLayout',
  components: {
    SizeTable,
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
      selected: '',
      show: false
    }
  },
  computed: {
    tables () {
      return Object.keys(this.content).filter(el => el.includes('table'))
    }
  },
  methods: {
    updateShow (param) {
      this.show = param
    }
  }
}
</script>
