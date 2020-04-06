<template>
  <ScissorArea>
    <div slot="dom" class="full">
      <slot></slot>
    </div>
    <FunScene slot="o3d"></FunScene>
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
