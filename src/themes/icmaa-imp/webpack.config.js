const merge = require('webpack-merge')
const path = require('path')

const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')

/**
 * You can extend default webpack build here.
 * @see https://docs.vuestorefront.io/guide/core-themes/webpack.html
*/
module.exports = function (config, { isClient, isDev }) {
  /**
   * Add Vue.js library with compiler to compile components in runtime
   * @see https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
   */
  if (isClient) {
    config = merge(config, {
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        }
      }
    })
  }

  /**
   * Inject postcss plugin for Tailwind.css to original webpack config.
   * Change the postcssConfig of the postcss-loader and add our loader plugin.
   *
   * You could also just change the following constant
   * of the original file "core/build/webpack.base.config.ts"
   */
  const postcssConfig = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: (loader) => [
        require('tailwindcss')(path.join(__dirname, 'tailwind.js')),
        require('postcss-flexbugs-fixes'),
        require('autoprefixer')({
          flexbox: 'no-2009'
        })
      ]
    }
  };

  const rewriteMapping = (rule) => {
    if (/(css|scss|sass)/.exec(rule.test)) {
      rule.use = rule.use.map(
        plugin => (plugin.loader && plugin.loader === 'postcss-loader') ? postcssConfig : plugin
      )
    }

    return rule
  }

  let rules = (isDev) ? config.default.module.rules : config.module.rules
  rules.map(rewriteMapping)

  /**
   * Create SVG sprites
   */
  const getSpriteConfig = (src = '', filename = 'default', targetPath = '', prefix = false, svg4everybody = true, svgo = true) => {
    targetPath = isDev ? path.join(__dirname, targetPath) : targetPath
    filename = `${targetPath}${filename}.svg`
    return new SVGSpritemapPlugin(
      path.join(__dirname, src),
      { output: { filename, svg4everybody, svgo }, sprite: { prefix } }
    )
  }

  config = merge(config, {
    plugins: [
      getSpriteConfig(path.join(__dirname, 'assets/flags/1x1/*.svg'), '1x1', 'assets/flags/'),
      getSpriteConfig(path.join(__dirname, 'assets/flags/4x3/*.svg'), '4x3', 'assets/flags/')
    ]
  })

  return config
}
