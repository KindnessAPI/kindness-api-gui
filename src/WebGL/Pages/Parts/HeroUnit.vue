<template>
  <ScissorArea>
    <div slot="dom" class="full">
      <div class="px-3 py-2 h-64">
        Apply, Practice, Inform Kindness for other applications.
      </div>
    </div>
    <HeroScene slot="o3d"></HeroScene>
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
