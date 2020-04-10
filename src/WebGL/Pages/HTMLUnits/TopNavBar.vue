<template>
  <ScissorArea>
    <div slot="dom">
      <div class="flex w-full justify-between items-center mx-auto max-w-6xl">
        <div class="text-4xl text-black p-3 cursor-pointer">
          KindnessAPI
        </div>
        <div class="mr-6 flex cursor-pointer">
          <div class="hidden md:inline-flex">
            <div class="text-2xl text-black p-3">
                Love Work in Progress
            </div>
          </div>
          <img @click="$emit('menu')" src="../icon/menu.svg" alt="">
        </div>
      </div>
      <!-- <TopNavBar @open="openMenu = true" @close="openMenu = false" @menu="openMenu = !openMenu"></TopNavBar> -->
    </div>
    <PhantomScene slot="o3d"></PhantomScene>
  </ScissorArea>
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
