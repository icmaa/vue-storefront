<template>
  <div>
    <template v-if="address.company">
      {{ address.company }} <br>
    </template>
    {{ address.firstname }} {{ address.lastname }} <br>
    {{ address.postcode }} {{ address.city }} <br>
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
  }
}
</script>
