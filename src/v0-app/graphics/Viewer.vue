<template>
  <div class="full" ref="toucher">
    <BGTemplate class="absolute full" @ready="engine = $event" :toucher="toucher"></BGTemplate>
    <Item class="absolute" v-if="engine" :engine="engine" :scene="engine.scene" @items="items = $event"></Item>
  </div>
</template>

<script>
export default {
  components: {
    Item: require('./Item.vue').default,
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
