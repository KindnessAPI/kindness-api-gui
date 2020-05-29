<template>
<div class="w-full h-full overflow-y-auto overflow-x-hidden border-t flex flex-col relative">
  <!-- <ScissorArea class="absolute top-0 left-0 right-0 bottom-0 h-full w-full" style="z-index: -1; margin-top: -1px;">
    <div slot="dom" class="full">
    </div>
    <DashboardScene slot="o3d"></DashboardScene>
  </ScissorArea> -->
  <main class="w-full p-6">
    <router-view></router-view>
    <!-- <ContentExampleTable></ContentExampleTable> -->
  </main>
</div>
</template>

<script>
export default {
  components: {
    ...require('../../../webgl').default
  }
}
</script>

<style>
</style>
