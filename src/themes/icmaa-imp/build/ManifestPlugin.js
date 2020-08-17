'use strict';

const fs = require('fs')
const path = require('path')
const template = require('lodash/template')

module.exports = class ManifestWebpackPlugin {
  constructor (options) {
    this.options = Object.assign({
      storeCodes: [],
      srcTmpl: '../assets/manifest.json',
      targetPrefix: 'manifest.'
    }, options)
  }

  apply (compiler) {
    const plugin = { name: 'ManifestWebpackPlugin' }

    compiler.hooks.emit.tap(plugin, compilation => {
      const templatePath = path.resolve(__dirname, this.options.srcTmpl)
      const templateStr = fs.readFileSync(templatePath)
      const compileTemplate = template(templateStr)

      this.options.storeCodes.forEach(storeCode => {
        const source = compileTemplate({ storeCode })
        compilation.emitAsset(
          `${this.options.targetPrefix}${storeCode}.json`,
          {
            source: () => source,
            size: () => source.length
          }
        )
      })
    })
  }
}
