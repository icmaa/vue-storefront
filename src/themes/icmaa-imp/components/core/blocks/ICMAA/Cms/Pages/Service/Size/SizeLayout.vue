<template>
  <div class="t-bg-white t-p-2 t-rounded t-mb-2">
    <size-navigation @toggle="updateShow" :headline="content.headline" :show="show" />
    <template v-if="show==true">
      <div class="t-flex t-flex-wrap">
        <div class="t-mt-2 t-text-sm lg:t-w-1/3 t-mb-2 t-mr-2">
          {{ content.description }}
        </div>
        <div class="t-flex t-justify-between t-mb-2">
          <img :src="content.image.boys" class="t-w-1/2 t-pr-2">
          <img :src="content.image.girls" class="t-w-1/2 t-pl-2">
        </div>
      </div>
      <div v-for="table in tables" :key="table">
        <size-table :table="content[table]" :headline="true" />
      </div>
    </template>
  </div>
</template>

<script>
import SizeTable from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/SizeTable'
import SizeNavigation from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Size/SizeNavigation'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'ServiceSizeLayout',
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
