<template>
  <div>
    <div class="">
      <div class="px-3 pt-3 pb-1 text-3xl md:text-4xl font-bold">
        Let's Connect People with Prayers & Kindness.
      </div>
      <div class="px-3 mb-2">
        <span class="inline-block cursor-pointer select-none hover:opacity-75 text-red-600 bg-red-200 px-3 py-2 mr-2 mb-2">Assure love</span> <span class="inline-block cursor-pointer select-none hover:opacity-75 text-green-600 bg-green-200 px-3 py-2 mr-2 mb-2">Pray for each other</span> <span class="inline-block cursor-pointer select-none hover:opacity-75 text-blue-600 bg-blue-200 px-3 py-2 mr-2 mb-2">Inform Kindness</span>
      </div>
      <div class="px-3">
        Spreading the word of ✞ Gospel via global technology infrastructure 👨🏼‍💻 and computer graphics art 🎨.
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
