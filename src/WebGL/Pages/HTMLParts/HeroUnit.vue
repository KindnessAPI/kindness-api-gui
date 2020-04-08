<template>
  <div>
    <div class="pt-3">
      <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
        Make Kindness Louder via Web Technologies
      </div>
      <div class="px-3 mb-2 text-xl lg:flex">
        <div class="mr-2">
          <span class="font-bold lg:font-normal">A</span>uthentic Community Building,
        </div>
        <div class="mr-2">
          <span class="font-bold lg:font-normal">P</span>lenty of Love,
        </div>
        <div class="mr-2">
          <span class="font-bold lg:font-normal">I</span>nspired by Gospel ✞
        </div>
      </div>
    </div>

    <ScissorArea>
      <div slot="dom" class="full">
        <div class="h-min90 md:h-min60">
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
