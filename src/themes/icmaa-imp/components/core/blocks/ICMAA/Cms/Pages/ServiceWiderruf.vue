<template>
  <layout id="cms-page" :headline="content.headline">
    <p>{{ content.text }}</p>
    <p class="t-mb-4">{{ content.subtext }}</p>
    <form-component :recaptcha="false" form-identifier="widerruf-formular" v-model="formData" @submit="submit" />
  </layout>
</template>

<script>
import { mapGetters } from 'vuex'
import Page from 'icmaa-cms/components/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'

import FormComponent from 'icmaa-forms/components/Form'

export default {
  name: 'ServiceWiderruf',
  mixins: [ Page ],
  components: {
    Layout,
    FormComponent
  },
  data () {
    return {
      dataType: 'yaml',
      formData: { }
    }
  },
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  }
}
</script>
