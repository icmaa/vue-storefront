# Custom CMS routes

In fact we wan't to make use of the benefits of [single-file-components](https://vuejs.org/v2/guide/single-file-components.html) in our CMS.

This means that there must be a rendered component registered to specific route and it's not possible to create them completely in a connected CMS on runtime. It's mainly because of the needed build of each component to make all functionallity like scoped css, code-splitteng and custom imports work.

## How we add custom cms pages

### Add a new single-file-component

At first we need to add our new single-file-component on top of the file like:

```javascript
const ServiceComponent = () => import(/* webpackChunkName: "vsf-icmaa-cms-page-custom-service" */ 'src/modules/icmaa-cms/pages/Page.vue')
```

It's important to have a custom `webpackChunkName`, thats why we use a prefix like `vsf-icmaa-cms-page-custom-` for each new component.

It's recommended to implement the default `page` mixins to your new component. A sample components could look like:
```html
<template>
  <div id="cms-page" v-if="page">
    <component :is="{template: content}" />
  </div>
</template>

<script>
import Page from 'src/modules/icmaa-cms/components/Page'

export default {
  mixins: [ Page ],
  computed: {
    content () {
      return `<div>${this.page.content}</div>`
    }
  }
}
</script>
```

### Add a new route

To add a new route which is using our custom single-file-component, we need to specify all neccessary data to the `routes` array in `theme/router/icmaa-cms/index.ts` like:

```json
{ name: 'service', path: '/:identifier', component: ServiceComponent }
```

A script on the bottom of this class will transform this route a bit to give it some unique prefixes to prevent duplicated routes and a consistent name structure. Finally the route will be registered like:

```json
{ name: 'icmaa-cms-custom-service', path: '/icmaa-cms-custom/service/:identifier', component: ServiceComponent }
```

## How to add/use cms data

### Html
…

### JSON
…

### YAML
…
