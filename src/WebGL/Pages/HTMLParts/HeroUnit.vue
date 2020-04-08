<template>
  <div>
    <div>
      <div class="px-3 pt-3 pb-1 text-3xl md:text-4xl font-bold">
        Making Kindness Louder with Technology
      </div>

      <div class="px-3 mb-2">
        <span class="inline-block cursor-pointer shadow-lg rounded-lg select-none hover:opacity-75 text-red-600 bg-red-200 px-3 py-2 mr-2 mb-2">Act with Kindnes</span>
        <span class="inline-block cursor-pointer shadow-lg rounded-lg select-none hover:opacity-75 text-green-600 bg-green-200 px-3 py-2 mr-2 mb-2">Pray for each other</span>
        <span class="inline-block cursor-pointer shadow-lg rounded-lg select-none hover:opacity-75 text-blue-600 bg-blue-200 px-3 py-2 mr-2 mb-2">Inspired by ✞ Gospel</span>
      </div>

      <div class="px-3">
        Spreading the word via global technology infrastructure 👨🏼‍💻 and computer graphics art 🎨.
      </div>
      <div class="px-3">
        REST APIs + Realtime WebSocket APIs & Computer Graphics SDKs
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
