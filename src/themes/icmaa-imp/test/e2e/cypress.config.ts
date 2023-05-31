import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    'baseUrl': 'http://localhost:3000',
    'fixturesFolder': 'fixtures',
    'specPattern': 'integration/**/*.spec.{js,jsx,ts,tsx}',
    'supportFile': 'support/index.ts',
    'trashAssetsBeforeRuns': true,
    'videoCompression': false,
    'videosFolder': 'videos',
    'videoUploadOnPasses': false,
    'screenshotsFolder': 'screenshots',
    'viewportWidth': 375,
    'viewportHeight': 812,
    'defaultCommandTimeout': 20000,
    'requestTimeout': 20000,
    'chromeWebSecurity': false,
    'env': {
      'store_codes': ['de', 'fr', 'es', 'uk', 'nl'],
      'category_pages': ['new.html', 'clothing.html', 'shoes.html', 'accessories.html']
    }
  }
})
