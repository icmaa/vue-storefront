<template>
  <div>
    <size-navigation
      :headline="content.headline"
      :show="show"
      @toggle="toggle"
    />
    <template v-if="show">
      <div class="t-my-4 t-flex t-flex-wrap">
        <div
          v-if="content.description"
          class="t-w-1/2 t-text-sm"
        >
          {{ content.description }}
        </div>
        <img
          v-if="content.icon"
          class="t-w-1/2 lg:t-w-1/3"
          :src="getMediaThumbnail(content.icon, 0, 0)"
        >
      </div>
      <div class="t-flex t-w-full t-flex-wrap t-justify-center">
        <div
          v-for="(table, index) in tables"
          :key="table"
          class="t-mb-4 t-mr-4 t-bg-white t-p-1"
        >
          <img
            :src="getMediaThumbnail(content[table].icon, 0, 0)"
            class="t-cursor-pointer t-border t-border-base-lighter t-p-1 t-opacity-25"
            :class="{ 't-opacity-100': selected == index }"
            @click="selected=index"
          >
        </div>
      </div>
      <div
        v-for="(table, index) in tables"
        :key="table"
      >
        <size-table
          v-show="selected==index"
          :table="content[table]"
        />
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
    toggle (param) {
      this.show = param
    }
  }
}
</script>
