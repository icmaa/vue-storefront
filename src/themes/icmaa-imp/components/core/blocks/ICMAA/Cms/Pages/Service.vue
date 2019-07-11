<template>
  <div id="cms-page" class="t-container t-p-4" v-if="page">
    <h1 v-html="content.quickHelp.headline" />
    <ul>
      <li v-for="question in content.quickHelp.questions" :key="question.text">
        <router-link :to="question.link" class="t-flex t-items-stretch t-mb-3 t-group">
          <i v-text="question.icon" class="material-icons t-flex-none t-mr-2 t-text-gray-400 t-group-hover:text-primary" />
          <span v-html="question.text" class="t-flex-auto t-group-hover:text-primary" />
        </router-link>
      </li>
    </ul>
    <h2 v-html="content.serviceTeam.headline" />
    <div class="t-flex t-flex-wrap t--mx-2">
      <div v-for="member in content.serviceTeam.team" :key="member.name" class="t-w-full t-sm:w-1/2 t-md:w-1/3 t-lg:w-1/4 t-px-2 t-pb-4">
        <div class="t-relative">
          <div v-html="member.name" class="t-absolute t-top-0 t-left-0 t-p-3 t-sm:p-4 t-font-serif t-text-gray-800 t-text-2xl" />
          <img :src="getThumbnail(member.img, 0, 0, 'cms')" :alt="member.name" class="t-border-gray-200 t-border-4">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Page from 'src/modules/icmaa-cms/components/Page'

export default {
  mixins: [ Page ],
  data () {
    return {
      dataType: 'yaml'
    }
  }
}
</script>
