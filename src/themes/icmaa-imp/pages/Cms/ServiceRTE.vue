<template>
  <Layout
    id="cms-page-rte"
    :headline="content.headline"
  >
    <component :is="content" />
  </Layout>
</template>

<script>
import Page from 'icmaa-cms/mixins/Page'
import Layout from 'theme/pages/Cms/Service/Layout'

export default {
  name: 'ServiceRTE',
  components: {
    Layout
  },
  mixins: [ Page ],
  asyncData ({ store }) {
    return store.dispatch('icmaaCmsBlock/single', { value: 'service-navigation' })
  },
  data () {
    return {
      dataType: 'markdown'
    }
  }
}
</script>

<style lang="scss">
@import '~theme/css/base/global_vars';

#cms-page-rte {

  .cms-page-rte {

    a {
      color: $color-primary;
    }

    p, ul, ol {
      margin-bottom: 1rem;
    }

    ul, ol {
      margin-left: 2rem;
    }

    ul {
      list-style: disc;
    }

    ol {
      list-style: decimal;
    }

    table {
      border: 1px solid;
      width: 100%;
      background-color: white;

      thead {
        border-bottom: 1px solid;
      }

      td, th {
        text-align: left;
        padding: .5rem;
      }

      tbody {

        tr {

          &:last-Child td {
            padding-bottom: 1rem;
          }

          &:first-Child td {
            padding-top: 1rem;
          }
        }
      }
    }

    hr {
      margin-top: 2rem;
      margin-bottom: 2rem;
      border-color: $color-baselight;
    }
  }
}
</style>
