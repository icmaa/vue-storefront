import kebabCase from 'lodash-es/kebabCase'
import snakeCase from 'lodash-es/snakeCase'
import camelCase from 'lodash-es/camelCase'
import upperFirst from 'lodash-es/upperFirst'

const upperCamelCase = (v) => upperFirst(camelCase(v))

export default {
  methods: {
    kebabCase,
    camelCase,
    upperCamelCase,
    snakeCase
  },
  filters: {
    kebabCase,
    camelCase,
    upperCamelCase,
    snakeCase
  }
}
