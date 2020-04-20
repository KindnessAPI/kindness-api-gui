<template>
  <div>
    <div class="relative">

      <ScissorArea class="h-min100 lg:h-min70 w-full">
        <div slot="dom" class="full">
        </div>
        <RiverScene slot="o3d"></RiverScene>
      </ScissorArea>

      <div class="max-w-xl lg:max-w-4xl xl:max-w-5xl mx-auto  py-12 lg:py-24">
        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Kindness River
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
