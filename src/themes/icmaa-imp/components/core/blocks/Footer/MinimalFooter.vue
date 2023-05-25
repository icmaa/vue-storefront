<template>
  <footer>
    <div class="footer-navigation t-bg-black t-py-4">
      <div class="t-container t-px-4">
        <div class="t--mx-4 lg:t-flex">
          <div class="t-flex t-w-full t-flex-wrap t-items-center t-justify-center t-leading-looser">
            <div class="copyright t-px-4 t-text-xs t-uppercase t-text-white lg:t-flex">
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

export default {
  name: 'MainFooter',
  computed: {
    ...mapGetters('icmaaCmsBlock', ['getJsonBlockByIdentifier']),
    footer () {
      return this.getJsonBlockByIdentifier('footer')
    }
  }
}
</script>
