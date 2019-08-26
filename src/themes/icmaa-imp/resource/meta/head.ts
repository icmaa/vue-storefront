import { storeCode, storeLang, store } from 'icmaa-meta/helper'
import hreflang from 'icmaa-meta/helper/head/hreflang'

const { meta, facebook } = store()

const defaults: any = {
  title: meta.title,
  titleTemplate: meta.titleTemplate.replace('{storeCode}', storeCode() !== 'default' ? storeCode().toUpperCase() : ''),
  htmlAttrs: {
    lang: storeLang()
  },
  meta: [
    { charset: 'utf-8' },
    { vmid: 'description', name: 'description', content: meta.description.default },
    { name: 'keywords', content: meta.keywords.default },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
    { generator: 'generator', content: 'Vue Storefront'},
    { name: 'robots', content: 'index, follow' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'theme-color', content: '#ffffff' },
    { property: 'fb:page_id', content: facebook.pageId },
    { property: 'fb:app_id', content: facebook.appId },
    { property: 'og:image', content: facebook.opengraph.image },
    { property: 'og:locale', content: facebook.opengraph.locale },
    { property: 'og:site_name', content: facebook.opengraph.siteName },
    { property: 'og:title', content: meta.title },
    { property: 'og:url', content: '' },
    { property: 'og:type', content: facebook.opengraph.type },
    { name: 'apple-mobile-web-app-title', content: meta.apple.mobileWebAppTitle },
    { name: 'apple-mobile-web-app-status-bar-style', content: '#ffffff' },
    { name: 'apple-itunes-app', content: meta.apple.itunesApp},
    { name: 'ICBM', content: meta.geo.position },
    { name: 'geo.placename', content: meta.geo.placename },
    { name: 'geo.position', content: meta.geo.position },
    { name: 'geo.region', content: meta.geo.region }
  ],
  link: [
    ...hreflang.getItems(),
    { rel: 'icon', type: 'image/png', href: '/assets/favicon-32x32.png', sizes: '32x32' },
    { rel: 'icon', type: 'image/png', href: '/assets/favicon-16x16.png', sizes: '16x16' },
    { rel: 'apple-touch-icon', href: '/assets/apple-touch-icon.png' },
    { rel: 'apple-touch-startup-image', href: '/assets/apple_splash_2048.png', sizes: '2048x2732' },
    { rel: 'apple-touch-startup-image', href: '/assets/apple_splash_1668.png', sizes: '1668x2224' },
    { rel: 'apple-touch-startup-image', href: '/assets/apple_splash_1536.png', sizes: '1536x2048' },
    { rel: 'apple-touch-startup-image', href: '/assets/apple_splash_1125.png', sizes: '1125x2436' },
    { rel: 'apple-touch-startup-image', href: '/assets/apple_splash_1242.png', sizes: '1242x2208' },
    { rel: 'apple-touch-startup-image', href: '/assets/apple_splash_750.png', sizes: '750x1334' },
    { rel: 'apple-touch-startup-image', href: '/assets/apple_splash_640.png', sizes: '640x1136' },
    { rel: 'manifest', href: '/assets/manifest.json' }
  ],
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/pwacompat@2.0.6/pwacompat.min.js',
      async: true,
      integrity: 'sha384-GOaSLecPIMCJksN83HLuYf9FToOiQ2Df0+0ntv7ey8zjUHESXhthwvq9hXAZTifA',
      crossorigin: 'anonymous'
    }
  ]
}

export default defaults
