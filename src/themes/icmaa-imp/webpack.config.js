const webpack = require('webpack')
const vsfConfig = require('config')
const merge = require('webpack-merge')
const path = require('path')

const i18nHelpers = require('@vue-storefront/i18n/helpers')

const SpritesmithPlugin = require('webpack-spritesmith')

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
    const addCompiler = {
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        }
      }
    }

    config = merge(config, addCompiler)
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
      plugins: () => [
        require('tailwindcss')(path.join(__dirname, 'tailwind.js')),
        require('postcss-flexbugs-fixes'),
        /**
         * Minify CSS using postcss-clean
         */
        require('postcss-clean')({
          keepSpecialComments: 0
        }),
        /**
         * Remove unused CSS classes using PurgeCSS
         * @see https://tailwindcss.com/docs/controlling-file-size/#app
         * */
        ...process.env.NODE_ENV === 'production' ? [
          require('@fullhuman/postcss-purgecss')({
            content: [
              '!**/node_modules',
              './{src,core}/**/*.html',
              './{src,core}/**/*.vue'
            ],
            whitelistPatterns: [ /^t-bg-*/, /^t-text-*/, /^vue-slider-*/, /^t-border-alt-*/ ],
            whitelistPatternsChildren: [ /^service-carrier*/ ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
          })
        ] : [],
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

  config.module.rules.map(rewriteMapping)

  /**
   * Remove `data-test-id` attributes from DOM for production mode
   * @see https://forum.vuejs.org/t/how-to-remove-attributes-from-tags-inside-vue-components/24138/9
   */
  if (!isDev && !process.env.CI_TESTS) {
    config.module.rules.map(rule => {
      if (rule.loader === 'vue-loader') {
        rule.options.compilerOptions = {
          modules: [
            {
              preTransformNode (el) {
                const { attrsMap, attrsList } = el
                if (attrsMap['data-test-id']) {
                  delete attrsMap['data-test-id']
                  attrsList.splice(attrsList.findIndex(x => x.name === 'data-test-id'), 1)
                }
                return el
              }
            }
          ]
        }
      }

      return rule
    })
  }

  /**
   * Add css sprites for service logos
   */

  const sprites = {
    plugins: [
      new SpritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, 'assets/logos'),
          glob: '{shipping,payment}/*.png'
        },
        target: {
          image: path.resolve(__dirname, '../../../dist/logos/sprite-footer-logos.[hash].png'),
          css: path.resolve(__dirname, 'css/base/_sprite-footer-logos.scss')
        },
        retina: '@2x',
        apiOptions: {
          cssImageRef: '/dist/logos/sprite-footer-logos.[hash].png'
        },
        spritesmithOptions: {
          padding: 0,
          algorithm: 'top-down'
        }
      })
    ]
  }

  config = merge(config, sprites)

  /**
   * Remove unecessary languages from `i18n-iso-countries` library
   */
  const locales = i18nHelpers.transformToShortLocales(i18nHelpers.currentBuildLocales())
  const localesRegex = locales.map(locale => `${locale}`).join('|')

  config = merge(config, {
    plugins: [
      new webpack.ContextReplacementPlugin(
        /i18n-iso-countries[/\\]langs$/,
        new RegExp(localesRegex)
      )
    ]
  })

  if (isClient) {
    /**
     * Create storeView based `manifest.json` files using `lodash.template`
     * (This is about PWA-/browser-manifests not webpack manifests)
     */
    const ManifestPlugin = require('./build/ManifestPlugin')
    config = merge(config, {
      plugins: [
        new ManifestPlugin({
          storeCodes: vsfConfig.storeViews.mapStoreUrlsFor
        })
      ]
    })

    /**
     * Add custom chunk groups for better caching
     *
     * ! We need to use `enforce: true` because of:
     * @see https://stackoverflow.com/a/61963152
     *
     * We also made some optimization to not load all languages into `app.js`. By default there is an dynamic-expression-require
     * inside `core/i18n/index.ts` which causes that all translations are loaded initially and bundled into the `app.js`. To
     * decrase the bundle-size, we changed this line into a static import (and use `en-US` as default) and chunk the default language.
     * @see https://github.com/DivanteLtd/vue-storefront/issues/4813
     */
    config = merge(config, {
      optimization: {
        splitChunks: {
          /**
           * I'm not sure if splitting the chunks into smaller portions
           * is useful or just causing more requests.
           */
          // maxSize: 250000,
          cacheGroups: {
            'commons': {
              enforce: true
            },
            'modules-icmaa': {
              test: new RegExp(`src/modules/icmaa-`),
              name: 'modules-icmaa',
              chunks: 'initial',
              enforce: true,
              priority: 2
            },
            'lang-default-json': {
              test: new RegExp(`core/i18n/resource/i18n/default\\.json`),
              chunks: 'initial',
              enforce: true,
              priority: 3
            }
          }
        }
      }
    })

    /**
     * [WIP] This was just an idea to improve the bundle-size by not needing to import the whole translations into
     * the package by copying all translation JSON files to build folder and then load them via `fetch` instead of `import`.
     * @see https://github.com/DivanteLtd/vue-storefront/issues/4813
     */
    // config = merge(config, {
    //   plugins: [
    //     new CopyPlugin([
    //       { from: 'core/i18n/resource/i18n/*.json' }
    //     ])
    //   ],
    // })

    /**
     * As we include `winston` as ssr logging library and this is a universal app, we need to tell
     * webpack that it should ignore this dependency for the client version to prevent an error while compilation.
     * @see https://github.com/webpack-contrib/css-loader/issues/447
     */
    config = merge(config, {
      node: {
        fs: 'empty'
      }
    })
  }

  return config
}
