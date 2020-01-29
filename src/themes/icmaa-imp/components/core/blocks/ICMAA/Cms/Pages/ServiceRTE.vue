<template>
  <layout id="cms-page-rte" :headline="content.headline">
    <vue-markdown :source="content" />
  </layout>
</template>

<script>
import Page from 'icmaa-cms/components/Page'
import Layout from 'theme/components/core/blocks/ICMAA/Cms/Pages/Service/Layout'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'ServiceRTE',
  mixins: [ Page ],
  components: {
    Layout,
    VueMarkdown
  },
  data () {
    return {
      dataType: 'markdown'
    }
  },
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  }
}
</script>

<style lang="scss">
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

$color-primary: #611122;

#cms-page-rte {

  .cms-page-rte {

    ul {
      list-style: disc;
      margin-left: 30px;
    }

    a {
      color: $color-primary;
    }

    p {
      margin-bottom: 10px;
    }

    table {
      border: 1px solid;
      width: 100%;

      thead {
        border-bottom: 1px solid;
      }

      td, th {
        text-align: left;
        padding: 8px;
      }
    }
  }
}
</style>
