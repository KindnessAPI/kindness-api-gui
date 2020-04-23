<template>
  <div>
    <div class="relative">

      <ScissorArea class="w-full header-banner">
        <div slot="dom" class="full">
        </div>
        <RiverFieldScene slot="o3d"></RiverFieldScene>
      </ScissorArea>

      <div class="h-12 lg:h-24"></div>
      <div class="lg:px-4 max-w-6xl mx-auto lg:ml-auto">
        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          <span>Kindness River</span>
        </div>
        <div class="px-3 text-lg mb-10">
          Testing...
        </div>
        <div class="px-3 mb-2 text-3xl lg:text-xl  font-bold">
          Kindness is like water. Water is life. We need it everyday to stay mentally healthy. With massive amount of stories, we can make a flowing river of Kindness. 🏄🏻‍♂️ 😆
        </div>
        <div class="px-3 text-lg pb-8">
          text
        </div>
      </div>
      <div class="h-12 lg:h-24"></div>
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
      hit: false
    }
  }
}
</script>

<style scoped lang="postcss">
.header-banner{
  height: 36rem;
}
</style>
