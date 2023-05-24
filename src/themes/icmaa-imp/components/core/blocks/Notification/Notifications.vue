<template>
  <div
    class="notifications t-fixed t-bottom-0 t-left-0 t-z-1000 t-w-full sm:t-ml-4 sm:t-w-3/12"
    data-test-id="Notifications"
  >
    <transition-group name="fade-down">
      <Notification
        v-for="(notification, index) in notifications"
        :key="`${notification.type}_${index}`"
        class="lg:t-mb-4"
        :index="index"
        :is-last="index === (notifications.length - 1)"
        v-bind="notification"
      />
    </transition-group>
  </div>
</template>

<script>
import { Notification as NotificationMixin } from '@vue-storefront/core/modules/notification/components/Notification'
import Notification from 'theme/components/core/blocks/Notification/Notification'

export default {
  name: 'Notifications',
  components: {
    Notification
  },
  mixins: [NotificationMixin]
}
</script>

<style lang="scss" scoped>
.notifications {

  .fade-down-enter-active, .fade-down-leave-active {
    max-height: 600px;
    overflow: hidden;
    transition: all .2s;
  }

  .fade-down-enter, .fade-down-leave-to {
    opacity: 0;
    max-height: 0px;
  }
}
</style>
