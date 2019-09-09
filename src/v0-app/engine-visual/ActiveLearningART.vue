<template>
  <div>
  </div>
</template>

<script>
let GLAPI = require('./geosim/geosim-sentiment-3d.js')

export default {
  props: {
    scene: {},
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
      this.api = GLAPI.makeAPI({ renderer: this.engine.renderer, scene: this.scene })
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
