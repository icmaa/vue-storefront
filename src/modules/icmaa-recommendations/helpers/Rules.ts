import forEach from 'lodash-es/forEach'
import Product from '@vue-storefront/core/modules/catalog/types/Product'
import SearchQuery from '@vue-storefront/core/lib/search/searchQuery'

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

class Rules {
  protected rules: { [ruleKey: string]: Rule }
  protected product: Product
  protected type: string
  protected query: SearchQuery

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
    this.query = new SearchQuery()

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
   * @returns {SearchQuery}
   */
  public getSearchQuery (): SearchQuery {
    return this.query
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
      .applyFilter({ key: 'visibility', value: { in: [2, 3, 4] } })
      .applyFilter({ key: 'status', value: { in: [0, 1] } })

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

      let method = this.filterMap[key] || 'filterAttributeValue'
      console.log(key, value, method)
      this[method](key, value)
    })

    return this
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {boolean} isOr
   * @returns {this}
   */
  protected filterAttributeNotNull (key: string, value: any, isOr: boolean = false): this {
    return this
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {boolean} isOr
   * @returns {this}
   */
  protected filterAttributeIsNull (key: string, value: any, isOr: boolean = false): this {
    return this
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {boolean} isOr
   * @returns {this}
   */
  protected filterAttributeSameAsCurrent (key: string, value: any, isOr: boolean = false): this {
    return this
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {boolean} isOr
   * @returns {this}
   */
  protected filterAttributeNotSameAsCurrent (key: string, value: any, isOr: boolean = false): this {
    return this
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {boolean} isOr
   * @returns {this}
   */
  protected filterAttributeGreaterOrEqual (key: string, value: any, isOr: boolean = false): this {
    return this
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {boolean} isOr
   * @returns {this}
   */
  protected filterAttributeLowerOrEqual (key: string, value: any, isOr: boolean = false): this {
    return this
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {boolean} isOr
   * @returns {this}
   */
  protected filterAttributeValue (key: string, value: any, isOr: boolean = false): this {
    return this
  }
}

export default Rules
