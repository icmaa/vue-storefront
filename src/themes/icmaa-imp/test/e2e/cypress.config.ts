import { defineConfig } from 'cypress'

const webpackPreprocessor = require('@cypress/webpack-preprocessor')

export default defineConfig({
  e2e: {
    'baseUrl': 'http://localhost:3000',
    'fixturesFolder': 'fixtures',
    'specPattern': 'integration/**/*.spec.{js,jsx,ts,tsx}',
    'supportFile': 'support/index.ts',
    'trashAssetsBeforeRuns': true,
    'videoCompression': false,
    'videosFolder': 'videos',
    'screenshotsFolder': 'screenshots',
    'viewportWidth': 375,
    'viewportHeight': 812,
    'defaultCommandTimeout': 20000,
    'requestTimeout': 20000,
    'chromeWebSecurity': false,
    'env': {
      'store_codes': ['de', 'fr', 'es', 'uk', 'nl'],
      'category_pages': ['new.html', 'clothing.html', 'shoes.html', 'accessories.html']
    },
    setupNodeEvents (on, config) {
      const options = {
        webpackOptions: require('./webpack.config.js')
      }
      on('file:preprocessor', webpackPreprocessor(options))
    }
  }
})
