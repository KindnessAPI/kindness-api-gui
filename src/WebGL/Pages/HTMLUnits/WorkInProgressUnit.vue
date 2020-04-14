<template>
  <div>
    <div class="relative py-12 lg:py-64">

      <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <MotherBoardScene slot="o3d"></MotherBoardScene>
      </ScissorArea>

      <div class="max-w-6xl mx-auto text-white py-32 lg:py-54">
        <router-link to="/work-in-progress">
          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold text-center cursor-pointer hover:scale-110 hover:underline">
            Work in Progress
          </div>
        </router-link>

        <!-- <div class="px-3 text-lg mb-10">
          Woop Woop! 🙌🏼
        </div> -->

        <!-- <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Let's do this! 🥰
        </div>
        <div class="px-3 text-lg mb-10">
          Woop Woop! 🙌🏼
        </div>

        <div class="block lg:flex">
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl  font-bold">
              Assure Love 💖
            </div>
            <div class="px-3 text-lg mb-2">
              We need to make sure each other are well loved by one another.
            </div>
          </div>
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Practice Kindness 🎹
            </div>
            <div class="px-3 text-lg mb-2">
              Love is what we do, not what we say. Personal encouragement experience is dope.
            </div>
          </div>
          <div class="lg:w-1/3">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">ho
              Inspired by Gospel 💒
            </div>
            <div class="px-3 text-lg mb-2">
              Gospel taught us so many wise lessons. Shairng wise life tips.
            </div>
          </div>
        </div> -->

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

<style>
</style>
