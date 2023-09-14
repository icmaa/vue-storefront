<template>
  <div>
    {{ title }}

    {{ block[0].headline }}
    {{ block[2].headline }}
    {{ block[4].headline }}
    {{ block[6].headline }}
    <br>
    <img :src="block[1].asset.filename">
    {{ block[3].asset.filename }}
    {{ block[5].asset.filename }}
    {{ block[7].asset.filename }}

    <!--
    - for schleife (i)  durch den block
    - gerade -> headline
    - ungreade -> imagecomponent !!
    -->
  </div>
</template>

<script lang="
    ts"
  >
export default {
  name: 'Tabs',
  props: {
    title: {
      type: String,
      required: true
    },
    block: {
      type: Array,
      required: true
    }
  }

}
</script>
