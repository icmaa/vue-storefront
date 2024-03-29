import config from 'config'
import { mapGetters } from 'vuex'
import { processURLAddress } from '@vue-storefront/core/helpers'

export default {
  props: {
    teaser: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    redirectToEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hover: false
    }
  },
  computed: {
    ...mapGetters({
      viewport: 'ui/getViewport'
    }),
    imageUrl () {
      return this.teaser.imageUrl
    },
    backgroundColor () {
      const { backgroundColor } = this.teaser
      return (!backgroundColor || !backgroundColor.startsWith('#')) ? false : backgroundColor
    },
    textColor () {
      const { textColor } = this.teaser
      return (!textColor || !textColor.startsWith('#')) ? false : textColor
    },
    link () {
      return this.localizedRoute(this.teaser.link)
    },
    editUrl () {
      return this.redirectToEdit ? processURLAddress(config.icmaa_cms.endpoint) + `/edit/${this.teaser.storyId}` : false
    }
  },
  methods: {
    setGender () {
      const { gender } = this.teaser
      if (gender && gender !== '' && gender !== 'none') {
        this.$store.dispatch('user/addSessionData', { key: 'gender', value: gender })
      }
    },
    redirect () {
      this.setGender()
      this.$router.push(this.link)
    },
    onHover (e) {
      if (this.redirectToEdit) {
        this.hover = (e.type === 'mouseover')
      }
    }
  }
}
