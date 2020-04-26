<template>
  <div class="">

    <ScissorArea class="w-full h-min70 xl:h-min60" style="z-index: 2;">
      <div slot="dom" class="full">
      </div>
      <ChurchScene slot="o3d"></ChurchScene>
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

<style scoped>
</style>
