<template>
  <Layout
    id="cms-page"
    :headline="content.headline"
  >
    <h2 v-html="content.quickHelp.headline" />
    <ul class="t-ml-5 t-list-disc">
      <li
        v-for="question in content.quickHelp.questions"
        :key="question.text"
      >
        <router-link
          :to="localizedRoute(question.link)"
          class="t-mb-2 t-flex t-text-base-tone"
        >
          {{ question.text }}
        </router-link>
      </li>
    </ul>
    <h2 v-html="content.serviceTeam.headline" />
    <div class="t--mx-2 t-flex t-flex-wrap">
      <div
        v-for="member in content.serviceTeam.team"
        :key="member.name"
        class="t-w-full t-px-2 t-pb-4 sm:t-w-1/2 md:t-w-1/3 xl:t-w-1/4"
      >
        <div class="t-relative t-border t-border-base-light">
          <div
            class="t-b t-bg-gray t-absolute t-left-0 t-top-0 t-mr-4 t-bg-base-light t-px-3 t-py-2 t-text-sm t-text-white"
            v-html="member.name"
          />
          <img
            :src="getMediaThumbnail(member.img, 0, 0)"
            :alt="member.name"
          >
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'

export default {
  name: 'Service',
  components: {
    Layout
  },
  mixins: [ Page ],
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  },
  data () {
    return {
      dataType: 'yaml'
    }
  }
}
</script>
