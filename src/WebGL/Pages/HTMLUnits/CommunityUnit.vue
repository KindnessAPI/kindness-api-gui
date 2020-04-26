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
            Community 🥰
          </div>
          <div class="px-3 mb-3">
            A Community of encouargment and healing from depressiom & loneliness
          </div>
          <div class="px-3 mb-5">
            Proverbs taught us so many life lessons. Loving one another, Helping each other, sharing wisdom within Christ Community.
          </div>
          <div class="px-3 text-lg pb-3 mb-3" v-if="$route.fullPath === '/'">
            <router-link class="font-bold underline inline-block" to="/register">Register</router-link> /
            <router-link class="font-bold underline inline-block" to="/login">Login</router-link> ✨
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
