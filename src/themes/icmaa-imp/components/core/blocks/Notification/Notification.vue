<template>
  <div
    class="notification t-cursor-pointer t-text-base t-text-white"
    :class="[type, backgroundColor]"
    data-test-id="NotificationItem"
  >
    <div
      class="message t-p-4 t-pb-1"
      data-test-id="NotificationItemMessage"
      @click="execAction(action1, index)"
    >
      {{ message }}
    </div>
    <div
      class="actions t-flex t-flex-wrap t-px-4 t-pt-2"
      :class="[ isLast ? 't-pb-8 lg:t-pb-2' : 't-pb-2' ]"
    >
      <ButtonComponent
        id="notificationAction1"
        type="white-custom"
        :class="[ 't-mb-2', 't-text-' + colorCode, { 't-mr-2': action2 } ]"
        size="sm"
        data-test-id="NotificationItemAction1"
        @click="execAction(action1, index)"
      >
        {{ action1 ? action1.label : $t('OK') }}
      </ButtonComponent>
      <ButtonComponent
        v-if="action2"
        id="notificationAction2"
        type="white-custom"
        :class="[ 't-mb-2', 't-text-' + colorCode ]"
        size="sm"
        data-test-id="NotificationItemAction2"
        @click="execAction(action2, index)"
      >
        {{ action2.label }}
      </ButtonComponent>
    </div>
  </div>
</template>

<script>
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'NotificationItem',
  components: {
    ButtonComponent
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    action1: {
      type: [Object, Boolean],
      default: false
    },
    action2: {
      type: [Object, Boolean],
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    backgroundColor () {
      return 't-bg-' + this.colorCode
    },
    borderColor () {
      return 't-border-' + this.colorCode
    },
    colorCode () {
      switch (this.type) {
        case 'success':
          return 'alt-3'
        case 'error':
          return 'alert'
        case 'warning':
        case 'info':
          return 'alt-2'
        default:
          return 'base-tone'
      }
    }
  },
  methods: {
    execAction (action, index) {
      if (action && typeof action.action === 'function') {
        action.action()
      }
      this.$store.dispatch('notification/removeNotification', index)
    }
  }
}
</script>
