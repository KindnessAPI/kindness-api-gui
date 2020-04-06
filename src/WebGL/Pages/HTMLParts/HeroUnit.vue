<template>
  <div>
    <div class="">
      <div class="px-3 pt-3 pb-1 text-3xl md:text-4xl font-bold">
        Let's Connect People with Prayers & Kindness.
      </div>
      <div class="px-3 mb-1">
        <span class="font-bold text-red-600 bg-red-200 p-1">Assure</span> love, <span class="font-bold text-green-600 bg-green-200 p-1">Pray</span> for each other & <span class="font-bold text-blue-600 bg-blue-200 p-1">Inform</span> Kindness.
      </div>
      <div class="px-3">
        Spreading the word of ✞ Gospel via our Global Technology Infrastructure and Computer Graphics Art.
      </div>

      <!--
        <div class="px-3">
          Made with ✞ love in Hong Kong by @wonglok831
        </div>
      -->
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
