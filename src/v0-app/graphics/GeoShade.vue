<template>
  <div class="full">
    <BGTemplate class="absolute full" v-if="toucher" @ready="engine = $event; setup()" :toucher="toucher"></BGTemplate>
    <Flower class="absolute full" :textpad="textpad" v-if="engine" :engine="engine"></Flower>
    <div class="absolute full"  ref="toucher"></div>
    <!-- <div class="absolute">
      <textarea type="text" v-model="textpad" @input="onText"></textarea>
    </div> -->
  </div>
</template>

<script>
export default {
  components: {
    BGTemplate: require('./BGTemplate.vue').default,
    Flower: require('./Flower.vue').default
  },
  data () {
    return {
      textpad: '',
      items: false,
      toucher: false,
      engine: false
    }
  },
  mounted () {
    this.toucher = this.$refs['toucher']
  },
  methods: {
    setup () {
    },
    onText () {
    }
  }
}
</script>

<style>

</style>
