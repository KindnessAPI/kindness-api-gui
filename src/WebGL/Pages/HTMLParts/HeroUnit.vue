<template>
  <div>
    <div class="pt-3">
      <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
        Make Kindness Louder via Web Technologies
      </div>
      <div class="px-3 mb-2 text-xl lg:flex">
        <div class="mr-2">
          Authentic Communities,
        </div>
        <div class="mr-2">
          Pray for each other,
        </div>
        <div class="mr-2">
          Inspired by Gospel
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

    <div class="px-3 mb-2 text-2xl font-bold">
      How do we do that?
    </div>
    <div class="px-3 mb-2">
      Computer Graphics, Realtime Interactions and Data Queries
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
