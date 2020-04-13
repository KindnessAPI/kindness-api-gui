<template>
  <div>
    <div class="relative pt-12">

      <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <CTARegisterScene slot="o3d"></CTARegisterScene>
      </ScissorArea>
      <div class="max-w-6xl mx-auto">

        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Let's do this! 💖
        </div>
        <div class="px-3 text-lg mb-10">
          Let's Go!!!
        </div>

        <div class="block lg:flex">
          <div class="pb-10 lg:w-1/2 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Text Text Text Text ? 😇
            </div>
            <div class="px-3 text-lg mb-2">
              Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text TextText Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text
            </div>
          </div>
          <div class="pb-10 lg:w-1/2 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Text Text Text Text Text
            </div>
            <div class="px-3 text-lg mb-2">
              Text Text Text Text Text Text Text Text Text Text Text TextText Text Text Text Text Text Text Text Text Text Text TextText Text Text Text Text Text Text Text Text Text Text Text
            </div>
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

<style>
</style>
