<template>
  <FormComponent
    v-if="form"
    v-model="formData"
    :form-elements="formElements"
    v-bind="attrs"
    @submit="submit"
  />
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
    attrs () {
      let $attrs = this.$attrs

      const { submitButtonText, recaptcha } = this.form
      if (submitButtonText !== '') {
        $attrs = Object.assign({ submitButtonText }, $attrs)
      }
      if (recaptcha !== undefined) {
        $attrs = Object.assign({ recaptcha }, $attrs)
      }

      return omit($attrs, ['elements', 'value'])
    }
  },
  watch: {
    formData (data) {
      this.$emit('input', data)
    }
  },
  async mounted () {
    return this.$store.dispatch('icmaaForms/single', { value: this.formIdentifier })
  },
  methods: {
    submit () {
      this.$emit('submit')
    }
  }
}
</script>
