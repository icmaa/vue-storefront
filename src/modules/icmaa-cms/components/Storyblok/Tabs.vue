<template>
  <div>
    <ul class="t-m-0 t-list-none t-bg-primary t-px-2.5 t-py-0 t-text-center">
      <li
        v-for="(item, index) in headlineItems"
        :key="index"
        class="t-inline-block t-text-white"
      >
        <input
          :id="'tab-' + item._uid"
          v-model="selectedTab"
          type="radio"
          class="tab-input t-hidden"
          name="tabs"
          :value="index"
        >
        <label
          :for="'tab-' + item._uid"
          class="tab-label t-inline-block t-cursor-pointer t-p-2 md:t-p-5"
        >{{ item.headline }}</label>
      </li>
    </ul>

    <div class="image-container">
      <div v-if="selectedTab !== null">
        <router-link :to="block[getTabIndex(selectedTab)].component_link">
          <img
            class="t-h-auto t-max-w-full"
            :src="block[getTabIndex(selectedTab)].asset.filename"
            :alt="block[getTabIndex(selectedTab)].asset.alt"
            :title="block[getTabIndex(selectedTab)].asset.title"
          >
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Tabs',
  props: {
    title: {
      type: String,
      required: true
    },
    block: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selectedTab: 0 // show first tab
    };
  },
  computed: {
    headlineItems () {
      return this.block.filter(item => item.component === 'component_headline');
    }
  },
  methods: {
    getTabIndex (tabIndex) {
      return tabIndex * 2 + 1;
    }
  }
};

</script>

<style>
.tab-input:checked + .tab-label,
.tab-label:hover {
  background-color: rgb(77, 7, 22) ;
}
</style>
