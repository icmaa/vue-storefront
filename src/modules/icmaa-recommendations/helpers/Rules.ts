class Rules {
  protected config: Record<string, any>
  protected type: string

  public constructor (type: string = 'crosssell') {
    this.type = type
    this.setConfig(type)
  }

  /**
   * @param type string
   * @returns this
   */
  protected setConfig (type: string) {
    const configs = require('../rules.json')
    if (configs[type]) {
      this.config = configs[type]
    }

    return this
  }
}

export default Rules
