<template>
  <div></div>
</template>

<script>
import marked from 'marked'
import DOMPurify from 'dompurify'
export default {
  mounted () {
    let def = this.$slots.default
    if (def && def[0] && def[0].text) {
      let raw = def[0].text
      let dirtyHTML = marked(raw)
      let cleanHTML = DOMPurify.sanitize(dirtyHTML)
      this.$el.innerHTML = cleanHTML
    }
  }
}
</script>

<style>

</style>
