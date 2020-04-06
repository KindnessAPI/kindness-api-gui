<template>
  <ScissorArea>
    <div slot="dom" class="full">
      <slot></slot>
    </div>
    <WelcomeBannerScene slot="o3d"></WelcomeBannerScene>
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
