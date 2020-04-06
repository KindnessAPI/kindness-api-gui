<template>
  <div>
    <div class="">
      <div class="px-3 pt-3 pb-1 text-3xl md:text-4xl font-bold">
        Let's Connect People with Prayers & Kindness.
      </div>
      <div class="px-3">
        Technology is an amazing platform to Spread the word of Gospel, Apply, Practice and Inform Kindness.
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
