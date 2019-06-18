<template>
  <div class="full">
    <ActivePipe class="full overlay" v-if="toucher" :toucher="toucher" :runComposer="false" :glowConfig="glowConfig">
      <template v-slot:scene="engine">
        <ActiveLearningART class="full" :engine="engine"></ActiveLearningART>
      </template>
    </ActivePipe>

    <div class="full overlay" ref="toucher">
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ActivePipe: () => import(/* webpackChunkName: "engine" */ '../engine/ActivePipe.vue'),
    ActiveLearningART: () => import(/* webpackChunkName: "content" */ '../engine-visual/ActiveLearningART.vue')
  },
  data () {
    return {
      toucher: false,
      glowConfig: {
        exposure: 1,
        threshold: 0.0846740050804403,
        strength: 0.9551227773073666,
        radius: 1.0343776460626588
      }
    }
  },
  mounted () {
    this.toucher = this.$refs.toucher
  }
}
</script>

<style scoped>
.overlay{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}

.hero-happy{
  position: absolute;
  bottom: 20px;
  left: 0px;
  width: 100%;
  text-align: center;
  font-size: 25px;
}

@media screen and (min-width: 767px) {
  .hero-happy{
    font-size: 45px;
  }
}
</style>
