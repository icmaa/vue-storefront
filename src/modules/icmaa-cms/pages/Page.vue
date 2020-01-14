<template>
  <div id="cms-page" class="t-container t-p-4" v-if="page">
    <component :is="content" v-if="isComponent" />
  </div>
</template>

<script>
import Page from 'icmaa-cms/components/Page'

export default {
  mixins: [ Page ]
}
</script>
