import forEach from 'lodash-es/forEach'
import Product from '@vue-storefront/core/modules/catalog/types/Product'

class Rules {
  protected config: Record<string, any>
  protected product: Product
  protected type: string

  protected assertionMap: Record<string, any> = {
    'not null': 'assertAttributeNotNull',
    'is null': 'assertAttributeIsNull'
  }

  /**
   * @param {Product} product
   * @param  {string} type
   */
  public constructor (product: Product, type: string = 'crosssell') {
    this.type = type
    this.product = product
    this.setConfig(type)

    forEach(this.config, (rule, ruleKey) => {
      if (!this.isValid(rule, ruleKey)) {
        return
      }

      // Add filter

      if (!rule.continue || rule.continue === false) {
        return false
      }
    })
  }

  /**
   * @param {string} type
   * @returns {this}
   */
  protected setConfig (type: string) {
    const configs: Record<string, any> = require('../rules.json')
    if (configs[type]) {
      this.config = configs[type]
    }

    return this
  }

  /**
   * @param {object} rule
   * @param {string} key
   * @return {boolean}
   */
  protected isValid (rule: Record<string, any>, key: string): boolean {
    if (!rule.if || Object.values(rule.if).length === 0) {
      return true
    }

    let check = true
    forEach(rule.if, (value: string, attribute: string) => {
      if (!this.assert(attribute, value)) {
        check = false
        return false
      }
    })

    return check
  }

  /**
   * @param {string} attribute
   * @param {string} value
   * @return {boolean}
   */
  protected assert (attribute: string, value: string): boolean {
    let method = this.assertionMap[value] || 'assertAttributeSameAs'
    if (typeof value === 'string' && value.startsWith('!')) {
      method = 'assertAttributeNotSameAs'
    }

    return this[method](attribute, value)
  }

  /**
   * @param {string} attribute
   * @param {string} value
   * @return {boolean}
   */
  protected assertAttributeNotNull (attribute: string, value: string): boolean {
    return this.product[attribute] && this.product[attribute] !== null
  }

  /**
   * @param {string} attribute
   * @param {string} value
   * @return {boolean}
   */
  protected assertAttributeIsNull (attribute: string, value: string): boolean {
    return !this.assertAttributeNotNull(attribute, value)
  }

  /**
   * @param {string} attribute
   * @param {string|any[]} value
   * @param {boolean} assertion
   * @return {boolean}
   */
  protected assertAttributeSameAs (attribute: string, value: string|any[], assertion: boolean = true): boolean {
    const productValue = this.product[attribute]
    if (!Array.isArray(value)) {
      value = [value]
    }

    if (Array.isArray(productValue)) {
      return productValue.find(v => value.includes(v) === assertion)
    } else {
      return value.includes(productValue) === assertion
    }
  }

  /**
   * @param {string} attribute
   * @param {string|any[]} value
   * @return {boolean}
   */
  protected assertAttributeNotSameAs (attribute: string, value: string|any[]): boolean {
    return this.assertAttributeSameAs(attribute, value, false)
  }
}

export default Rules
