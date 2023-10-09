<template>
  <div class="t--mx-4 t-flex t-flex-full t-flex-wrap">
    <div
      v-for="(c, i) in aggregatedComponents"
      :key="`${c.name}-${i}`"
      class="t-flex-auto"
      :class="[{ 't-px-4': c.padding, 't-w-full': (c.size === 'full'), 'lg:t-w-1/2': (c.size === 'half') }, c.cssClass, c.type]"
    >
      <router-link
        v-if="c.hasLink"
        :to="localizedRoute(c.props.componentLink)"
      >
        <component
          :is="c.component"
          v-bind="c.props"
          :name="c.type"
        />
      </router-link>
      <template v-else>
        <Lazyload v-if="c.lazyload">
          <component
            :is="c.component"
            v-bind="c.props"
            :name="c.type"
          />
        </Lazyload>
        <component
          :is="c.component"
          v-else
          v-bind="c.props"
          :name="c.type"
        />
      </template>
    </div>
  </div>
</template>

<script>
import omit from 'lodash-es/omit'
import pickBy from 'lodash-es/pickBy'
import mapKeys from 'lodash-es/mapKeys'
import mapValues from 'lodash-es/mapValues'
import camelCase from 'lodash-es/camelCase'

import Lazyload from 'icmaa-cms/components/Lazyload'

const AsyncLogoline = () => import(/* webpackChunkName: "vsf-content-block-logoline" */ 'theme/components/core/blocks/CategoryExtras/LogoLine')
const AsyncTeaser = () => import(/* webpackChunkName: "vsf-content-block-teaser" */ 'theme/components/core/blocks/Teaser/Teaser')
const AsyncHeadline = () => import(/* webpackChunkName: "vsf-content-block-headline" */ 'theme/components/core/blocks/Headline')
const AsyncText = () => import(/* webpackChunkName: "vsf-content-block-text" */ 'theme/components/core/blocks/RichText')
const AsyncPicture = () => import(/* webpackChunkName: "vsf-content-block-picture" */ 'theme/components/core/blocks/Picture')
const AsyncProductlisting = () => import(/* webpackChunkName: "vsf-content-block-productlisting" */ 'icmaa-category/components/ProductListingWidget')
const AsyncTicketlisting = () => import(/* webpackChunkName: "vsf-content-block-ticketlisting" */ 'icmaa-category/components/TicketListingWidget')
const AsyncProductlistingticketposter = () => import(/* webpackChunkName: "vsf-content-block-productlistingticketposter" */ 'icmaa-category/components/ProductListingTicketWidget')
const AsyncCategorylist = () => import(/* webpackChunkName: "vsf-content-block-categorylist" */ 'icmaa-category/components/List/List')
const AsyncLinkList = () => import(/* webpackChunkName: "vsf-content-block-linklist" */ 'theme/components/core/blocks/CategoryExtras/LinkList')
const AsyncInstagramPost = () => import(/* webpackChunkName: "vsf-content-block-instagram-post" */ 'icmaa-cms/components/Storyblok/InstagramPost')
const AsyncTikTokPost = () => import(/* webpackChunkName: "vsf-content-block-tiktok-post" */ 'icmaa-cms/components/Storyblok/TikTokPost')
const AsyncTwitter = () => import(/* webpackChunkName: "vsf-content-block-twitter" */ 'icmaa-cms/components/Storyblok/Twitter')
const AsyncYouTube = () => import(/* webpackChunkName: "vsf-content-block-youtube" */ 'icmaa-cms/components/Storyblok/YouTube')
const AsyncTabs = () => import(/* webpackChunkName: "vsf-content-block-tabs" */ 'icmaa-cms/components/Storyblok/Tabs')
const AsyncSpotify = () => import(/* webpackChunkName: "vsf-content-block-spotify" */ 'icmaa-cms/components/Storyblok/Spotify')
const AsyncBlogList = () => import(/* webpackChunkName: "vsf-content-block-blog-list" */ 'icmaa-blog/components/ListWrapper')
const AsyncStoryblokAsset = () => import(/* webpackChunkName: "vsf-content-block-storyblog-asset" */ 'icmaa-cms/components/Storyblok/Asset')

const rteComponentOptions = {
  component: AsyncText,
  propsTypes: {},
  propsDefaults: {
    tagClasses: { img: 't-block t-mb-4 lg:t-float-right lg:t-ml-4 lg:t-mb-0' }
  },
  cssClass: 't-mb-4',
  padding: true
}

export default {
  name: 'CmsBlockWrapper',
  components: {
    Lazyload
  },
  props: {
    components: {
      type: Array,
      required: true
    },
    defaults: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  computed: {
    componentsMap () {
      return {
        'component_teaser': {
          component: AsyncTeaser,
          propsTypes: {
            limit: 'number',
            tags: (v) => v.join(',')
          },
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: false
        },
        'component_logoline': {
          component: AsyncLogoline,
          propsTypes: {
            parentId: 'number',
            staticItems: 'json',
            limit: 'number'
          },
          propsDefaults: {
            placeholder: true,
            columnClass: 't-w-1/3 md:t-w-1/6 lg:t-w-1/4 t-pb-2'
          },
          cssClass: 't-mb-4 lg:t-mb-6',
          padding: true
        },
        'component_headline': {
          component: AsyncHeadline,
          propsTypes: {},
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: false
        },
        'component_text': {
          ...rteComponentOptions
        },
        'component_rte': {
          ...rteComponentOptions
        },
        'component_image': {
          component: AsyncPicture,
          propsTypes: {
            sizes: 'json'
          },
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: true
        },
        'component_productlisting': {
          component: AsyncProductlisting,
          propsTypes: {
            limit: 'number',
            categoryId: 'number',
            filter: 'json'
          },
          propsDefaults: {
            filter: {}
          },
          cssClass: 't-mb-4',
          padding: false
        },
        'component_ticketlisting': {
          component: AsyncTicketlisting,
          propsTypes: {
            limit: 'number',
            categoryId: 'number',
            filter: 'json'
          },
          propsDefaults: {
            filter: {}
          },
          cssClass: 't-mb-4',
          padding: false
        },
        'component_categorylist': {
          component: AsyncCategorylist,
          propsTypes: {
            categoryId: 'number'
          },
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: false
        },
        'component_linklist': {
          component: AsyncLinkList,
          propsTypes: {
            items: 'json'
          },
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: false
        },
        'component_productlistingticketposter': {
          component: AsyncProductlistingticketposter,
          propsTypes: {},
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: false
        },
        'component_instagram_post': {
          component: AsyncInstagramPost,
          propsTypes: {},
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: true
        },
        'component_tiktok_post': {
          component: AsyncTikTokPost,
          propsTypes: {},
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: true
        },
        'component_twitter': {
          component: AsyncTwitter,
          propsTypes: {},
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: true
        },
        'component_youtube': {
          component: AsyncYouTube,
          propsTypes: {},
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: true
        },
        'component_tabs': {
          component: AsyncTabs,
          propsTypes: {},
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: true
        },
        'component_spotify': {
          component: AsyncSpotify,
          propsTypes: {},
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: true
        },
        'component_blog_list': {
          component: AsyncBlogList,
          propsTypes: {
            size: 'number',
            query: 'json'
          },
          propsDefaults: {
            query: {}
          },
          cssClass: 't-mb-4',
          padding: true
        },
        'component_asset': {
          component: AsyncStoryblokAsset,
          propsTypes: {
            asset: 'json',
            sizes: 'json',
            width: 'number',
            height: 'number'
          },
          propsDefaults: {},
          cssClass: 't-mb-4',
          padding: true
        }
      }
    },
    aggregatedComponents () {
      return this.components
        .filter(c => Object.keys(this.componentsMap).includes(c.component))
        .map(c => {
          const componentsMap = this.componentsMap[c.component]
          const { component, propsTypes, propsDefaults, cssClass, padding } = componentsMap
          const propsDefaultsOverwrites = this.defaults[c.component] || {}

          const size = (typeof c?.width === 'string' && c?.width) || 'full'
          const lazyload = c?.lazyload || false

          let props = mapKeys(
            omit(c, ['_uid', 'component', 'width', 'lazyload']),
            (v, k) => camelCase(k)
          )

          props = pickBy(props, (p, k) => {
            return p !== '' || (propsTypes[k] && propsTypes[k] === 'number' && p === 0)
          })

          props = Object.assign(propsDefaults, propsDefaultsOverwrites, props)

          props = mapValues(props, (p, k) => {
            if (Object.keys(propsTypes).includes(k)) {
              switch (propsTypes[k]) {
                case 'number':
                  p = parseInt(p)
                  break
                case 'json':
                  if (typeof p === 'string') {
                    p = JSON.parse(p)
                  }
                  break
                default:
                  if (typeof propsTypes[k] === 'function') {
                    p = propsTypes[k](p)
                  }
              }
            }

            return p
          })

          const type = c.component.replace('component_', '')
          const hasLink = Object.keys(props).includes('componentLink')

          return { type, component, props, cssClass, padding, size, hasLink, lazyload }
        })
    }
  }
}
</script>
