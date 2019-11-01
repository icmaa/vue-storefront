<template>
  <div>
    <div v-for="(s, i) in status" :key="i" v-html="twitterify(s.text)" />
  </div>
</template>

<script>
import TwitterStatusFeed from 'icmaa-twitter/components/TwitterStatusFeed'

export default {
  name: 'TwitterStatusFeed',
  mixins: [ TwitterStatusFeed ]
}
</script>
