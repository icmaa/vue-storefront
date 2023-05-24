<template>
  <BaseSelect
    v-model="gender"
    :options="genderOptions"
    :initial-option-text="$t('Gender')"
    v-bind="{ ...$props, ...$attrs }"
    @input="$emit('input', $event)"
  />
</template>

<script>
import GenderMixin from 'icmaa-user/mixins/gender'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'

export default {
  name: 'GenderSelect',
  components: {
    BaseSelect
  },
  mixins: [ GenderMixin ],
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      gender: this.value
    }
  }
}
</script>
