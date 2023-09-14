<template>
  <div>
    <!--Tabs navigation-->
    <ul
      class="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
      role="tablist"
      data-te-nav-ref
    >
      <li
      v-for="(tab, index) in block"
      :key="index"
      role="presentation">
        <a
          href="#tabs-home"
          class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
          data-te-toggle="pill"
          data-te-target="#tabs-home"
          data-te-nav-active
          role="tab"
          aria-controls="tabs-home"
          aria-selected="true"
        >{{ tab.headline }}</a>
      </li>
    </ul>

    <!--Tabs content-->

    <div class="mb-6">
      <div
        v-for="(tab, _uid) in block"
        :key="_uid"
        id="tabs-home"
        class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
        role="tabpanel"
        aria-labelledby="tabs-home-tab"
        data-te-tab-active
      >
        <img :src="tab.asset.filename"/>
      </div>
    </div>
  </div>
</template>

<script lang="
    ts"
  >
/* import {
  Tab,
  initTE
} from 'tw-elements';

initTE({ Tab }); */

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
  }

}
</script>
