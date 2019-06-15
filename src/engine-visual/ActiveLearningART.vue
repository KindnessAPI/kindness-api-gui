<template>
  <div>
  </div>
</template>

<script>

export default {
  props: {
    engine: {}
  },
  data () {
    return {
      api: {}
    }
  },
  async mounted () {
    let GLAPI = false
    // GLAPI = await import('./geosim/geosim.js')
    if (process.env.NODE_ENV === 'development') {
      GLAPI = require('./geosim/geosim.js')
    }
    this.api = GLAPI.makeAPI({ renderer: this.engine.renderer, scene: this.engine.scene })
    this.engine.execStack.renderActiveLearningART = () => {
      this.api.render()
    }
  },
  beforeDestroy () {
    this.engine.execStack.renderActiveLearningART = () => {
    }
    this.api.clean()
  }
}
</script>

<style>

</style>
