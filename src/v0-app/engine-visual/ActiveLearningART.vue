<template>
  <div>
  </div>
</template>

<script>
let GLAPI = require('./geosim/geosim.js')

export default {
  props: {
    engine: {}
  },
  data () {
    return {
      api: {}
    }
  },
  mounted () {
    this.setup()
  },
  methods: {
    async setup () {
      this.api = GLAPI.makeAPI({ renderer: this.engine.renderer, scene: this.engine.scene })
      this.engine.execStack.renderActiveLearningART = () => {
        this.api.render()
      }
    }
  },
  beforeDestroy () {
    this.api.clean()
    this.engine.execStack.renderActiveLearningART = () => {}
  }
}
</script>

<style>

</style>
