<template>
  <div>
    <ScissorArea>
      <div slot="dom" class="full">
        <div class="h-min90 md:h-min50">
        </div>
      </div>
      <HowScene slot="o3d"></HowScene>
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
