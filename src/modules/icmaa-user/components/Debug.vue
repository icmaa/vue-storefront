<template>
  <div class="t-my-4 t-flex t-w-full t-justify-end">
    <button-component
      v-for="(o, i) in values"
      :key="i"
      :type="currentValue == o.value ? 'ghost' : 'second'"
      class="t-mr-2"
      @click="setValue(o.value)"
    >
      {{ o.label }}
    </button-component>
    <button-component
      type="ghost"
      icon="delete"
      :icon-only="true"
      @click="setValue()"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'SessionFilterDebug',
  components: {
    ButtonComponent
  },
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
