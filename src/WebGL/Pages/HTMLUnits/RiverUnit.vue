<template>
  <div class="item-box">
    <div class="relative h-full w-full">
      <ScissorArea class="w-full h-full">
        <div slot="dom" class="full">
          Kindness River {{ hit }}
        </div>
        <RiverHeartsScene @hit="$emit('hit', $event); onHit($event)" slot="o3d"></RiverHeartsScene>
      </ScissorArea>

      <!-- <ScissorArea class="w-full h-full">
        <div slot="dom" class="full">
        </div>
        <RiseScene slot="o3d"></RiseScene>
      </ScissorArea> -->
      <!-- <div class="absolute top-0 left-0 full text-white">
        <div class=" max-w-xl lg:max-w-4xl xl:max-w-5xl mx-auto  py-12 lg:py-12">
          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">

          </div>
        </div>
      </div> -->

    </div>
  </div>
</template>

<script>
export default {
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      toucher: false,
      hit: false
    }
  },
  mounted () {
    this.toucher = this.$el
  },
  methods: {
    onHit (v) {
      this.hit = Math.abs(Math.sin(v) * Math.sin(-v))
    }
  }
}
</script>

<style scoped>
.item-box{
  position: relative;
  display: block;
  width: 100%;
  height: calc(100% - 78px);
}
</style>
