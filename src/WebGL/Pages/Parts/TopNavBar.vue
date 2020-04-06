<template>
  <div class="flex w-full justify-between items-center">
    <div class="text-4xl text-white p-3 cursor-pointer">
      KindnessAPI
    </div>
    <div class="hidden md:block text-2xl text-white p-3">
      GitHub
    </div>
    <div class="inline-block md:hidden mr-6 cursor-pointer">
      <img @click="$emit('menu')" src="../icon/menu.svg" alt="">
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
