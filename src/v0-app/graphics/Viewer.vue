<template>
  <div class="full" ref="toucher">
    <BGTemplate class="absolute full" @ready="engine = $event" :toucher="toucher"></BGTemplate>
    <GLBItem class="absolute" v-if="engine" :engine="engine" :scene="engine.scene" @items="items = $event"></GLBItem>
    <!-- <FBXItem class="absolute" v-if="engine" :engine="engine" :scene="engine.scene" @items="items = $event"></FBXItem> -->
  </div>
</template>

<script>
export default {
  components: {
    GLBItem: require('./GLBItem.vue').default,
    // FBXItem: require('./FBXItem.vue').default,
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
