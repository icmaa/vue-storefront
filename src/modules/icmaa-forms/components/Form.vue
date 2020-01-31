<template>
  <form-component v-if="form" :form-elements="formElements" v-bind="attrs" v-model="formData" @submit="submit" />
</template>

<script>
import { mapGetters } from 'vuex'
import FormComponent from 'theme/components/core/blocks/Form/Form'
import omit from 'lodash-es/omit'

export default {
  name: 'CmsForm',
  components: {
    FormComponent
  },
  props: {
    formIdentifier: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      formData: {}
    }
  },
  watch: {
    formData (data) {
      this.$emit('input', data)
    }
  },
  computed: {
    ...mapGetters({
      getFormByIdentifier: 'icmaaForms/getFormByIdentifier'
    }),
    form () {
      return this.getFormByIdentifier(this.formIdentifier)
    },
    formElements () {
      return this.form.elements || []
    },
    submitButtonText () {
      return this.form.submitButtonText || false
    },
    attrs () {
      const $attrs = this.$attrs
      if (this.submitButtonText) {
        Object.assign($attrs, { submitButtonText: this.submitButtonText })
      }

      return omit($attrs, ['elements', 'value'])
    }
  },
  methods: {
    submit () {
      this.$emit('submit')
    }
  },
  mounted () {
    this.$store.dispatch('icmaaForms/single', { value: this.formIdentifier })
  }
}
</script>
