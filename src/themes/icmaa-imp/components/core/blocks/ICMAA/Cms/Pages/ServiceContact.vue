<template>
  <layout id="cms-page" :headline="content.headline">
    <p class="t-mb-4" v-html="content.context" />
    <div v-for="(s, i) in subjects" :key="i">
      <div class="t-flex t-justify-between t-cursor-pointer">
        <div @click="selectedSubject = s.name">
          {{ s.name }}
        </div>
        <material-icon icon="keyboard_arrow_right" v-if="selectedSubject === s.name" @click.native="clearSelection()" />
      </div>
      <div v-if="s.children && s.children.length > 0 && selectedSubject === s.name">
        <div v-for="(c, j) in s.children" :key="j" class="t-flex t-justify-between t-cursor-pointer">
          <div @click="selectedChild = c.name">
            {{ c.name }}
          </div>
          <material-icon icon="keyboard_arrow_right" v-if="selectedChild === c.name" @click.native="clearSelection(false)" />
        </div>
      </div>
    </div>
    <template v-if="formVisible">
      <form-component form-identifier="service-contact" v-model="formData" @submit="sendMail()" />
    </template>
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
      selectedChild: false
    }
  },
  computed: {
    formVisible () {
      return (this.selectedSubject && this.selectedChild) || (this.selectedSubject && this.selectedSubject.hasOwnProperty('children'))
    },
    subjects () {
      return this.content.subjects.filter(s => !this.selectedSubject || this.selectedSubject === s.name)
    },
    subject () {
      const sub = this.selectedChild ? ` - ${this.selectedChild}` : ''
      return `${this.selectedSubject || ''}${this.selectedChild}`
    }
  },
  methods: {
    clearSelection (all = true) {
      this.selectedSubject = false
      if (all) {
        this.selectedChild = false
      }
    },
    sendMail () {
      return this.$store.dispatch('icmaaForms/mail', { subject: this.subject, data: this.formData })
    }
  },
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  }
}
</script>
