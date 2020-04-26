<template>
  <div>
    <div class="relative">

      <ScissorArea class="scissor-right" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <RiverFieldScene slot="o3d"></RiverFieldScene>
      </ScissorArea>

      <div class="scissor-left scissor-text">
        <div class="h-24 lg:h-32 xl:h-64"></div>
        <div class="lg:px-4 max-w-xl mx-auto lg:ml-auto">

          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            Kindness InstaPress 💧
          </div>

          <div class="px-3 mb-3">
            Kindness Story is like water. It's vital to sustaining good mental health. 🥰
          </div>
          <div class="px-3 mb-3">
            Each Kindness Story is like a droplet of water 💧, small but personally truthful, special, essential, valid, irrevocable and significant. 🍭
          </div>
          <div class="px-3 mb-3">
            Each and every of our droplet of Kindness come together, a formation of Kindness Ocean is right wihtin our hearts.
          </div>
          <div class="px-3 mb-3">
            With water flowing, it's a symbol of living being and serving one antoher with love and vitality.
          </div>
          <div class="px-3 mb-3">
            With Developers, an installed API can instantly share information across web sites, platforms and apps.
          </div>
          <div class="px-3 mb-3">
            Pause and remember: Love is avaialbe to you the moment you are avaialbe to love. - Jenni Young McGill
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
</style>
