import Translation from '../helpers/defaultTranslator'

export default {
  filters: {
    translate (text) {
      const t = new Translation({ prefix: 'TS', text })
      return t.translate()
    }
  }
}
