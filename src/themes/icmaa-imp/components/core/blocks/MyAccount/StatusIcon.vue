<template>
  <div class="status-icon t-mx-1" :class="status" />
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    style () {
      return {
        s: 'white'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.status-icon {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  display: inline-block;
}

.canceled {
  background-color: gray;
}

.pending {
  background-color: #b20a0e;
}

.processing {
  background-color: #f7c603;
}

.complete {
  background-color: #297825;
}

.preorder {
  background-color: #006ea1;
}
</style>
