<template>
  <div id="cms-page" class="container px-4" v-if="page">
    <h1 v-html="content.quickHelp.headline" />
    <ul>
      <li v-for="question in content.quickHelp.questions" :key="question.text">
        <router-link :to="question.link" class="flex items-stretch mb-3 group">
          <i v-text="question.icon" class="material-icons flex-none mr-2 text-gray-400 group-hover:text-primary" />
          <span v-html="question.text" class="flex-auto group-hover:text-primary" />
        </router-link>
      </li>
    </ul>
    <h2 v-html="content.serviceTeam.headline" />
    <div class="flex flex-wrap -mx-2">
      <div v-for="member in content.serviceTeam.team" :key="member.name" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 pb-4">
        <div class="relative">
          <div v-html="member.name" class="absolute top-0 left-0 p-3 sm:p-4 font-serif text-gray-800 text-2xl" />
          <img :src="getThumbnail(member.img, 0, 0, 'cms')" :alt="member.name" class="border-gray-200 border-4">
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
