import forEach from 'lodash-es/forEach'
import Product from '@vue-storefront/core/modules/catalog/types/Product'
import bodybuilder from 'bodybuilder'

export interface RuleSets {
  [ruleSetKey: string]: {
    [ruleKey: string]: Rule
  }
}

export interface Rule {
  continue?: boolean,
  if: Record<string, any>,
  then: Record<string, any>
}

export interface FilterOptions {
  key: string,
  value: any,
  isOr: boolean
}

class Rules {
  protected rules: { [ruleKey: string]: Rule }
  protected product: Product
  protected type: string
  protected query: bodybuilder.Bodybuilder

  protected assertionMap: Record<string, string> = {
    'not null': 'assertAttributeNotNull',
    'is null': 'assertAttributeIsNull'
  }

  protected filterMap: Record<string, string> = {
    'not null': 'filterAttributeNotNull',
    'is null': 'filterAttributeIsNull',
    'current': 'filterAttributeSameAsCurrent',
    'not current': 'filterAttributeNotSameAsCurrent',
    'greater': 'filterAttributeGreaterOrEqual',
    'lower': 'filterAttributeLowerOrEqual'
  }

  /**
   * @param {Product} product
   * @param  {string} type
   */
  public constructor (product: Product, type: string = 'crosssell') {
    this.type = type
    this.product = product
    this.query = bodybuilder()

    this
      .setRules(type)
      .addDefaultFilter()

    forEach(this.rules, (rule, ruleKey) => {
      if (!this.isValid(rule, ruleKey)) {
        return
      }

      this.addFilter(rule.then)

      if (!rule.continue || rule.continue === false) {
        return false
      }
    })
  }

  /**
   * @returns {bodybuilder.Bodybuilder}
   */
  public getSearchQuery (): Record<string, any> {
    return this.query.build()
  }

  /**
   * @param {string} type
   * @returns {this}
   */
  protected setRules (type: string) {
    const rules: RuleSets = require('../rules.json')
    if (rules[type]) {
      this.rules = rules[type]
    }

    return this
  }

  /**
   * @param {Rule} rule
   * @param {string} key
   * @returns {boolean}
   */
  protected isValid (rule: Rule, key: string): boolean {
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
   * @returns {boolean}
   */
  protected assert (attribute: string, value: string): boolean {
    let method = this.assertionMap[value] || 'assertAttributeSameAs'
    return this[method](attribute, value)
  }

  /**
   * @param {string} attribute
   * @param {string} value
   * @returns {boolean}
   */
  protected assertAttributeNotNull (attribute: string, value: string): boolean {
    return this.product[attribute] && this.product[attribute] !== null
  }

  /**
   * @param {string} attribute
   * @param {string} value
   * @returns {boolean}
   */
  protected assertAttributeIsNull (attribute: string, value: string): boolean {
    return !this.assertAttributeNotNull(attribute, value)
  }

  /**
   * @param {string} attribute
   * @param {string|any[]} value
   * @param {boolean} assertion
   * @returns {boolean}
   */
  protected assertAttributeSameAs (attribute: string, value: string|any[]): boolean {
    const productValue = this.product[attribute]
    if (!Array.isArray(value)) {
      value = [value]
    }

    if (Array.isArray(productValue)) {
      return productValue.find(v => value.includes(v))
    } else {
      return value.includes(productValue)
    }
  }

  /**
   * @returns {this}
   */
  protected addDefaultFilter (): this {
    this.query
      .filter('terms', 'visibility', [2, 3, 4])
      .filter('terms', 'status', [0, 1])

    return this
  }

  /**
   * @param {Rule} rule
   * @param {boolean} isOr
   * @returns {this}
   */
  protected addFilter (filter: Record<string, any>, isOr: boolean = false): this {
    forEach(filter, (value, key) => {
      if (key === 'or') {
        this.addFilter(value, true)
        return
      }

      const method = this.filterMap[value] || 'filterAttributeValue'
      const filter = this[method]({ key, value, isOr })

      if (filter) {

      }
    })

    return this
  }

  /**
   * @returns {this}
   */
  protected filterAttributeNotNull ({ key, isOr }: FilterOptions): this {
    if (isOr) {
      this.query.orQuery('bool', (b) => {
        return b.query('exists', key, null)
      })
    } else {
      this.query.query('exists', key, null)
    }

    return this
  }

  /**
   * @returns {this}
   */
  protected filterAttributeIsNull ({ key, isOr }: FilterOptions): this {
    if (isOr) {
      this.query.orQuery('bool', (b) => {
        return b.notQuery('exists', key, null)
      })
    } else {
      this.query.notQuery('exists', key, null)
    }

    return this
  }

  /**
   * @returns {this}
   */
  protected filterAttributeSameAsCurrent ({ key, value, isOr }: FilterOptions): this|boolean {
    value = this.product[key]
    if (!value) {
      return this
    }

    if (isOr) {
      this.query.orQuery('bool', (b) => {
        return b.query('terms', key, this.getArrayFilterValue(value))
      })
    } else {
      this.query.query('terms', key, this.getArrayFilterValue(value))
    }

    return this
  }

  /**
   * @returns {this}
   */
  protected filterAttributeNotSameAsCurrent ({ key, value, isOr }: FilterOptions): this|boolean {
    value = this.product[key]
    if (!value) {
      return this
    }

    if (isOr) {
      this.query.orQuery('bool', (b) => {
        return b.notQuery('terms', key, this.getArrayFilterValue(value))
      })
    } else {
      this.query.notQuery('terms', key, this.getArrayFilterValue(value))
    }

    return this
  }

  /**
   * @returns {this}
   */
  protected filterAttributeGreaterOrEqual ({ key, value, isOr }: FilterOptions): this {
    if (isOr) {
      this.query.orQuery('bool', (b) => {
        return b.query('range', key, { gte: value })
      })
    } else {
      this.query.query('range', key, { gte: value })
    }

    return this
  }

  /**
   * @returns {this}
   */
  protected filterAttributeLowerOrEqual ({ key, value, isOr }: FilterOptions): this {
    if (isOr) {
      this.query.orQuery('bool', (b) => {
        return b.query('range', key, { lte: value })
      })
    } else {
      this.query.query('range', key, { lte: value })
    }

    return this
  }

  /**
   * @returns {this}
   */
  protected filterAttributeValue ({ key, value, isOr }: FilterOptions): this {
    if (isOr) {
      this.query.orQuery('bool', (b) => {
        return b.query('terms', key, this.getArrayFilterValue(value))
      })
    } else {
      this.query.query('terms', key, this.getArrayFilterValue(value))
    }

    return this
  }

  /**
   * @param {any[]} value
   * @returns {any[]}
   */
  protected getArrayFilterValue (value: any): any[] {
    if (!Array.isArray(value)) {
      return [value]
    }

    return value
  }
}

export default Rules
