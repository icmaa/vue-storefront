<template>
  <div class="shipping">
    Shipping:
    {{ getShippingMethods }}
  </div>
</template>

<script>
import Shipping from 'icmaa-checkout/components/Shipping'

export default {
  components: {

  },
  mixins: [ Shipping ],
  computed: {

  },
  validations () {

  }
}
</script>
