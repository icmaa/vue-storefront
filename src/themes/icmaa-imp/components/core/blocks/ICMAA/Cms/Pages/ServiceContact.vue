<template>
  <layout id="cms-page" :headline="content.headline">
    <!-- Subject selection -->
    <div v-for="(subject, index) in content.subject" :key="index">
      <template v-if="selectedSubject=='' || selectedSubject == subject">
        <div class="t-flex t-justify-between t-cursor-pointer t-bg-base-lightest t-rounded-sm t-mb-4 t-p-4" @click="selectedSubject=subject">
          <div>{{ subject.name }}</div>
          <div v-show="selectedSubject==subject" @click.stop="clearSelection()">
            <span class="t-font-hairline t-uppercase">{{ $t('Ändern') }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- Child selection -->
    <template v-if="hasChildren()">
      <h2>{{ $t('Worum handelt es sich genau') }}</h2>
      <div v-if="selectedSubject!=''" v-for="child in selectedSubject.children" :key="child.name">
        <template v-if="selectedChild=='' || selectedChild == child">
          <div class="t-flex t-justify-between t-cursor-pointer t-bg-base-lightest t-rounded-sm t-mb-4 t-p-4" @click.stop="selectedChild=child">
            <div>
              {{ child.name }}
            </div>
            <div v-show="selectedChild==child" @click.stop="selectedChild=''">
              <span class="t-font-hairline t-uppercase">{{ $t('Ändern') }}</span>
            </div>
          </div>
        </template>
      </div>
    </template>

    <!-- Form -->
    <template v-if="showForm()">
      <form-component :recaptcha="false" form-identifier="service-contact" v-model="formData" @submit="sendMail()" />
    </template>
  </layout>
</template>

<script>
import Page from 'icmaa-cms/components/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'
import FormComponent from 'icmaa-forms/components/Form'

export default {
  name: 'ServiceContact',
  mixins: [Page],
  components: {
    Layout,
    FormComponent
  },
  data () {
    return {
      formData: { },
      dataType: 'json',
      selectedSubject: '',
      selectedChild: ''
    }
  },
  asyncData ({ store }) {
    return Promise.all([
      store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' }),
      store.dispatch('icmaaCmsBlock/single', { value: 'service-contact' }),
      store.dispatch('icmaaForms/single', { value: 'service-contact' })
    ])
  },
  methods: {
    getEmailSubject () {
      const subject = `${this.selectedSubject.name || ''}${this.selectedChild.name ? ` - ${this.selectedChild.name}` : ''}`
      console.log(subject)
      return subject
    },
    clearSelection () {
      this.selectedSubject = ''
      this.selectedChild = ''
    },
    hasChildren () {
      return this.selectedSubject.children || false
    },
    showForm () {
      return (this.selectedSubject !== '' && this.selectedChild !== '') || (this.selectedSubject !== '' && !this.selectedSubject.children)
    },
    sendMail () {
      return this.$store.dispatch('icmaaForms/mail', { subject: this.getEmailSubject(), data: this.formData })
    }
  }
}
</script>

<style scoped>

</style>
