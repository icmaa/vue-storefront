<template>
  <layout>
    <h2 v-html="content.test" />
  </layout>
</template>

<script>
import Page from 'icmaa-cms/components/Page'
import ButtonComponent from 'theme/components/core/blocks/Button'

export default {
  name: 'ImpericonNeverSayDie',
  mixins: [ Page ],

  data () {
    return {
      dataType: 'yaml'
    }
  }
}
</script>
