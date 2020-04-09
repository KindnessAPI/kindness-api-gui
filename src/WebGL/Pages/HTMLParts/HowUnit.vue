<template>
  <div>
    <div class="px-3 mb-2 text-3xl font-bold">
      How do we do that?
    </div>

    <div class="px-3 mb-2">
      We got Computer Graphics, Realtime Online Interactions and Data Queries inside our toolbox.
    </div>

    <ScissorArea>
      <div slot="dom" class="full">
        <div class="h-min90 md:h-min60">
        </div>
      </div>
      <HowScene slot="o3d"></HowScene>
    </ScissorArea>

    <div class="px-3 h-min100"></div>
    <div class="px-3 h-min100"></div>
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
