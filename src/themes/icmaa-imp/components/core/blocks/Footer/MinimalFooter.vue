<template>
  <footer>
    <div class="footer-navigation t-bg-black t-py-4">
      <div class="t-container t-px-4">
        <div class="t--mx-4 lg:t-flex">
          <div class="t-flex t-w-full t-flex-wrap t-items-center t-justify-center t-leading-looser">
            <div class="copyright t-px-4 lg:t-flex t-text-white t-text-xs t-uppercase">
              © Impericon is a Division of IC Music and Apparel GmbH
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
import CurrentPage from 'theme/mixins/currentPage'

export default {
  name: 'MainFooter',
  mixins: [ CurrentPage ],
  computed: {
    ...mapGetters('icmaaCmsBlock', ['getJsonBlockByIdentifier']),
    footer () {
      return this.getJsonBlockByIdentifier('footer')
    }
  }
}
</script>
