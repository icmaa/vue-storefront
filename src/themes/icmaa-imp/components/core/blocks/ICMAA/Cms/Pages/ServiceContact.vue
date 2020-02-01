<template>
  <layout id="cms-page" :headline="content.headline">
    <p class="t-mb-2 t-font-bold t-text-sm" v-html="content.context" />
    <div :class="{ 't-mb-6': formVisible }">
      <div v-for="(s, i) in subjects" :key="i">
        <div class="t-flex t-items-center t-justify-between t-cursor-pointer t-border-t t-border-base-lightest t-p-2 t-pl-0" :class="{ 't-opacity-50': !isSelectedSubject(s.name) && selectedSubject}" @click="toggleSubject(s)">
          <material-icon icon="indeterminate_check_box" v-if="isSelectedSubject(s.name)" />
          <material-icon icon="check_box_outline_blank" v-else class=" t-text-base-lighter" />
          <div class="t-flex-1 t-ml-1">
            {{ s.name }}
          </div>
        </div>
        <div v-if="s.children && s.children.length > 0 && selectedSubject === s.name">
          <p class="t-border-base-lightest t-border-t t-py-2 t-font-bold t-text-sm" v-html="content.context_more" />
          <div v-for="(c, j) in s.children" :key="j" class="t-flex t-items-center t-justify-between t-cursor-pointer t-border-t t-border-base-lightest t-p-2 t-pl-0" :class="{ 't-opacity-50': !isSelectedChildSubject(c.name) && selectedChildSubject}" @click="toggleSubject(c, true)">
            <material-icon icon="indeterminate_check_box" v-if="isSelectedChildSubject(c.name)" />
            <material-icon icon="check_box_outline_blank" v-else class="t-text-base-lighter" />
            <div class="t-flex-1 t-ml-1">
              {{ c.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <form-component form-identifier="service-contact" v-model="formData" @submit="sendMail()" v-if="formVisible" />
  </layout>
</template>

<script>
import Page from 'icmaa-cms/components/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'
import FormComponent from 'icmaa-forms/components/Form'
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'ServiceContact',
  mixins: [Page],
  components: {
    Layout,
    FormComponent,
    MaterialIcon
  },
  data () {
    return {
      formData: { },
      dataType: 'yaml',
      selectedSubject: false,
      selectedChildSubject: false
    }
  },
  computed: {
    formVisible () {
      return ((this.selectedSubject && this.selectedChildSubject) || (this.selectedSubject && !this.selectedSubjectHasChildren))
    },
    subjects () {
      return this.content.subjects.filter(s => !this.selectedSubject || !this.selectedSubjectHasChildren || this.selectedSubject === s.name)
    },
    subject () {
      const sub = this.selectedChildSubject ? ` - ${this.selectedChildSubject}` : ''
      return `${this.selectedSubject || ''}${sub}`
    },
    selectedSubjectHasChildren () {
      const subject = this.content.subjects.find(s => s.name === this.selectedSubject)
      return (subject && subject.hasOwnProperty('children'))
    }
  },
  methods: {
    toggleSubject (subject, isChild = false) {
      if (!isChild) {
        this.selectedSubject = !this.selectedSubject || this.selectedSubject !== subject.name ? subject.name : false
        this.selectedChildSubject = false
      } else {
        this.selectedChildSubject = !this.selectedChildSubject || this.selectedChildSubject !== subject.name ? subject.name : false
      }
    },
    clearSelection (clearChild = true) {
      this.selectedSubject = false
      this.selectedChildSubject = false
    },
    sendMail () {
      return this.$store.dispatch('icmaaForms/mail', { subject: this.subject, data: this.formData })
    },
    isSelectedSubject (subject) {
      return subject === this.selectedSubject
    },
    isSelectedChildSubject (subject) {
      return subject === this.selectedChildSubject
    }
  },
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  }
}
</script>
