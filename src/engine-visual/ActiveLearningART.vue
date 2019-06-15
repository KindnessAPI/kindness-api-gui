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
    let GLAPI = await import('./geosim/geosim.js')
    this.api = GLAPI.makeAPI({ renderer: this.engine.renderer, scene: this.engine.scene })
    this.engine.execStack.renderActiveLearningART = () => {
      this.api.render()
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
