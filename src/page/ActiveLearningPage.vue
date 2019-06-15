<template>
<div class="full">
  <ActiveEngine>
  </ActiveEngine>
</div>
</template>

<script>
// wire data
export default {
  components: {
    ActiveEngine: () => import('../engine/ActiveEngine.vue')
  }
}
</script>

<style>

</style>
