<template>
  <div class="w-full h-min-minus-toolbar-full">
    <div class="h-full w-full relative">

      <ScissorArea class="scissor-right" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <SpaceWalkScene slot="o3d"></SpaceWalkScene>
      </ScissorArea>

      <div class="scissor-left scissor-text flex-col justify-center items-center">
        <div class="h-24 lg:h-32 xl:h-64"></div>
        <div class="lg:px-4 max-w-xl mx-auto lg:ml-auto">
          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            Share your Prayer / Story 💧
          </div>

          <div class="px-3 mb-3">
            Prayer is like water. It's vital to sustaining good mental health. 🥰
          </div>
          <div class="px-3 mb-3">
            Imagine each Prayer is like a droplet of water 💧 truthful, special, essential, valid, irrevocable and significant.
          </div>
          <div class="px-3 mb-3">
            Each and every of our droplet of Prayer come together and form a Prayer Ocean.
          </div>
          <div class="px-3 mb-3">
            With water flowing, it's a symbol of living being and serving one antoher with love and vitality.
          </div>
          <div class="px-3 mb-3">
            Let's Spread the Gospel.
          </div>

        </div>
        <div class="h-24 lg:h-32 xl:h-64"></div>
      </div>
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

<style scoped lang="postcss">
.scissor-text{
}
.scissor-right{
  width: 100vmin;
  height: 100vmin;
}
.scissor-left{
  width: 100%;
  height: 100%;
}

@screen lg {
  .scissor-text{
    color: black;
  }
  .scissor-right{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 50%;
    height: 100%;
    margin-left: 50%;
  }
  .scissor-left{
    /* position: absolute;
    top: 0px;
    left: 0px; */
    width: 50%;
    height: 100%;
  }
}
.h-min-minus-toolbar-full{
  min-height: calc(100% - 60px);
}
</style>
