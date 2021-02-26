export default {
  computed: {
    localizedHomeRoute (): any {
      return this.localizedRoute({ name: 'home', path: '' })
    }
  }
}
