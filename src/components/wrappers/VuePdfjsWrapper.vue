<template>
  <vue-pdf-embed :source="url" :height="height" />
</template>

<script>
import VuePdfEmbed from 'vue-pdf-embed'

export default {
  components: {
    VuePdfEmbed,
  },
  props: ['url', 'height'],
}
</script>
