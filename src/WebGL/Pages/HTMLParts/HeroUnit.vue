<template>
  <div>
    <div class="">
      <div class="px-3 pt-3 pb-1 text-3xl md:text-4xl font-bold">
        Let's Connect People with Prayers & Kindness.
      </div>
      <div class="px-3">
        Spreading the word of ✞ Gospel, <span class="font-bold text-teal-600">A</span>ssure love, <span class="font-bold text-teal-600">P</span>ray for each other and <span class="font-bold text-teal-600">I</span>nform Kindness.
      </div>
    </div>
    <ScissorArea>
      <div slot="dom" class="full">
        <div class="h-min90 md:h-min70">
        </div>
      </div>
      <HeroScene slot="o3d"></HeroScene>
    </ScissorArea>
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
