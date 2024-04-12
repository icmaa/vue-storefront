<template>
  <div
    v-if="statusClass"
    class="t-flex t-items-center"
    :class="statusClass"
  >
    <MaterialIcon
      icon="lens"
      size="sm"
      class="t-mr-1"
    />
    <slot>
      {{ $t(`orderStatus_${status}`) }}
    </slot>
  </div>
</template>

<script>
import MaterialIcon from 'theme/components/core/blocks/MaterialIcon'

export default {
  name: 'StatusIcon',
  components: {
    MaterialIcon
  },
  props: {
    status: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      statusMap: {
        canceled: 't-text-base-light',
        complete: 't-text-alt-3',
        pending: 't-text-alert',
        pending_payment: 't-text-alert',
        preorder: 't-text-alt-1',
        processing: 't-text-alt-2'
      }
    }
  },
  computed: {
    statusClass () {
      if (this.statusMap[this.status]) {
        return this.statusMap[this.status]
      }

      return false
    }
  }
}
</script>
