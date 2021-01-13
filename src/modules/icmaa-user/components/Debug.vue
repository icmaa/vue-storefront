<template>
  <div class="t-flex t-w-full t-justify-end t-my-4">
    <button-component
      v-for="(o, i) in values"
      :key="i" @click="setValue(o.value)"
      :type="currentValue == o.value ? 'ghost' : 'second'"
      class="t-mr-2"
    >
      {{ o.label }}
    </button-component>
    <button-component type="ghost" @click="setValue()">
      Unset
    </button-component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'SessionFilterDebug',
  props: {
    attribute: {
      type: String,
      default: 'gender'
    },
    values: {
      type: Array,
      default: () => [
        { label: 'Boys', value: '9' },
        { label: 'Girls', value: '8' }
      ]
    }
  },
  components: {
    ButtonComponent
  },
  computed: {
    ...mapGetters({
      getSessionData: 'user/getSessionData'
    }),
    currentValue () {
      return this.getSessionData(this.attribute)
    }
  },
  methods: {
    setValue (value) {
      if (!value) {
        this.$store.dispatch('user/removeSessionData', this.attribute)
        return
      }
      this.$store.dispatch('user/addSessionData', { key: this.attribute, value })
    }
  }
}
</script>
