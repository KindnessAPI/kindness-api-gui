<template>
  <div>
    <div class="relative">

      <ScissorArea class="absolute top-0 left-0 scissor-left" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <StarFlowScene slot="o3d"></StarFlowScene>
      </ScissorArea>

      <div class="scissor-right scissor-text py-12 lg:py-32 xl:py-64">
        <div class="lg:px-4 max-w-xl mx-auto">
          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            Life, Canvas, Community 👩🏻‍🎤
          </div>
          <div class="px-3 mb-10">
            You are the art and the artist. - Brynat McGill 😎
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl  font-bold">
            Why community life is related to canvas?
          </div>
          <div class="px-3 mb-2">
            When you live your life. You draw in your canvas. You live your life as a masterpice by being a good artist to yourself and others. When we contribute to each other's canvas with love and kindness, we have a good community.
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
            How to make this?
          </div>
          <div class="px-3 mb-2">
            We need community because we need each other. Let's make each other's life canvas awesome!
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
            What is meaning of Life Art?
          </div>
          <div class="px-3 mb-2">
            Christian Gospel taught us so many life lessons. Loving one another, Helping each other, shairng wisdrom is what Churuch is about.
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
