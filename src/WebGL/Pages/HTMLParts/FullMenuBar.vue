<template>
  <div class="h-full md:h-min60 w-full absolute top-0 left-0 z-10">
    <ScissorArea class="full">
      <div slot="dom">
        <div class="flex w-full justify-between items-center">
          <div class="text-4xl text-white p-3 cursor-pointer">
            KindnessAPI
          </div>
          <div class="inline-block mr-6 cursor-pointer">
            <img @click="$emit('close')" src="../icon/close.svg" alt="">
          </div>
        </div>
        <div class="px-3 text-white">
          GoGoGo
        </div>
      </div>
      <PhantomScene slot="o3d"></PhantomScene>
    </ScissorArea>
  </div>
</template>

<script>
export default {
  props: {
  },
  components: {
    ...require('../../webgl').default
  }
}
</script>

<style>

</style>
