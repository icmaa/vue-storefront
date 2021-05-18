<template>
  <div>
    <template v-if="address.company">
      {{ address.company }} <br>
    </template>
    {{ address.firstname }} {{ address.lastname }}<br>
    {{ street }}<br>
    {{ address.postcode }} {{ address.city }}<br>
    <template v-if="address.region">
      {{ address.region }},
    </template>
    {{ address.country }}
  </div>
</template>

<script>
export default {
  name: 'AddressPreview',
  props: {
    address: {
      type: Object,
      required: true
    }
  },
  computed: {
    street () {
      return this.address.street.join(' ')
    }
  }
}
</script>
