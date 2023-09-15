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
          class="tab-label t-inline-block t-cursor-pointer t-p-5"
        >{{ item.headline }}</label>
      </li>
    </ul>

    <div class="image-container">
      <router-link :to="block[selectedTab + 1].component_link">
        <img
          v-if="selectedTab !== null"
          class="t-h-auto t-max-w-full"
          :src="block[selectedTab + 1].asset.filename"
          :alt="block[selectedTab + 1].asset.alt"
          :title="block[selectedTab + 1].asset.title"
        >
      </router-link>
    </div>
  </div>
</template>

<script lang="
    ts"
  >

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
  }
};

</script>

<style>
.tab-input:checked + .tab-label,
.tab-label:hover {
  background-color: rgb(77, 7, 22) ;
}
</style>
