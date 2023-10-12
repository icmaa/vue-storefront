<template>
  <div class="t-mx-auto t-max-w-screen-md t-bg-white t-p-8">
    <Newsletter
      :headline="headline"
      :description="description"
    />
  </div>
</template>

<script>
import Newsletter from 'theme/components/core/blocks/Footer/Newsletter'

export default {
  name: 'NewsletterSubscription',
  components: {
    Newsletter
  },
  props: {
    headline: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>
