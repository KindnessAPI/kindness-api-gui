<template>
  <div class="item-box">
    <div class="relative h-full w-full">
      <ScissorArea class="w-full h-full">
        <div slot="dom" class="full">
        </div>
        <RiverScene slot="o3d"></RiverScene>
      </ScissorArea>

      <!-- <ScissorArea class="w-full h-full">
        <div slot="dom" class="full">
        </div>
        <RiseScene slot="o3d"></RiseScene>
      </ScissorArea> -->

      <!-- <div class="max-w-xl lg:max-w-4xl xl:max-w-5xl mx-auto  py-12 lg:py-12">
        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Kindness River
        </div>
      </div> -->

    </div>
  </div>
</template>

<script>
export default {
  components: {
    ...require('../../webgl').default
  }
}
</script>

<style scoped>
.item-box{
  display: block;
  width: 100%;
  height: calc(100% - 78px);
}
</style>
