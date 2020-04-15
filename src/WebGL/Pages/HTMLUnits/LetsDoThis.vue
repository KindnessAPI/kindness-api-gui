<template>
  <div>
    <div class="relative py-12">

      <ScissorArea class="absolute top-0 left-0 scissor-left" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <StarFlowScene slot="o3d"></StarFlowScene>
      </ScissorArea>

      <div class="scissor-right scissor-text py-32">
        <div class="lg:pl-12">
          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            Let's do this! 🥰
          </div>
          <div class="px-3 text-lg mb-10">
            Woop Woop! 🙌🏼
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl  font-bold">
            Assure Love 💖
          </div>
          <div class="px-3 text-lg mb-2">
            We need to make sure each other are well loved by one another.
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
            Practice Kindness 🎹
          </div>
          <div class="px-3 text-lg mb-2">
            Love is what we do, not what we say. Personal encouragement experience is dope.
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
            Inspired by Gospel 💒
          </div>
          <div class="px-3 text-lg mb-2">
            Gospel taught us so many wise lessons. Shairng wise life tips.
          </div>
        </div>

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
  color: white;
}
.scissor-right{
  width: 100%;
  height: 100%;
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
    width: 50%;
    height: 100%;
    margin-left: 50%;
  }
  .scissor-left{
    width: 50%;
    height: 100%;
  }
}
</style>
