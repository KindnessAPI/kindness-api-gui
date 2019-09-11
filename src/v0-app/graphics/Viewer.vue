<template>
  <div class="full" ref="toucher">
    <BGTemplate class="absolute full" @ready="engine = $event" :toucher="toucher"></BGTemplate>
    <NLP class="absolute" v-if="engine" :engine="engine" :scene="engine.scene" @items="items = $event"></NLP>
    <Bubble v-if="engine" :camera="engine.camera" :scene="engine.scene"></Bubble>
    <!-- <FBXItem class="absolute" v-if="engine" :engine="engine" :scene="engine.scene" @items="items = $event"></FBXItem> -->
  </div>
</template>

<script>
export default {
  components: {
    NLP: require('./NLP.vue').default,
    Bubble: require('./Bubble.vue').default,
    BGTemplate: require('./BGTemplate.vue').default
  },
  data () {
    return {
      items: false,
      toucher: false,
      engine: false
    }
  },
  mounted () {
    this.toucher = this.$refs['toucher']
  }
}
</script>

<style>

</style>
