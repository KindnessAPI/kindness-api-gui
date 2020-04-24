<template>
  <div>
    <div class="relative">

      <ScissorArea class="scissor-right" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <RiverFieldScene slot="o3d"></RiverFieldScene>
      </ScissorArea>

      <div class="scissor-left scissor-text">
        <div class="h-12 lg:h-32 xl:h-64"></div>
        <div class="lg:px-4 max-w-xl mx-auto lg:ml-auto">

          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            Kindness Life Stories 🤗
          </div>

          <div class="px-3 text-lg mb-3">
            Everyone's life story matters! 🍭
          </div>

          <div class="px-3 pb-8">
            Kindness is like water. Water is life. Water cleanses toxins. We need it everyday to stay mentally healthy. Each life story is like a droplet of water, small but essential.
            Let's make a <strong>Kindness River</strong> to heal many! 💧 🏞 🏄🏻‍♂️
          </div>

          <div class="px-3 text-lg pb-3 font-bold underline" v-if="$route.fullPath === '/'" >
            <router-link to="/kindness-river">Learn more...</router-link>
          </div>

        </div>
        <div class="h-12 lg:h-32 xl:h-64"></div>
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
