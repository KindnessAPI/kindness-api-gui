<template>
  <div class="item-unit h-full w-full">
    <ScissorArea class="w-full h-full" style="z-index: -1;">
      <div slot="dom" class="full bg-gray pt-3">

        <div class="text-white px-3">
          <div class="px-3 mb-3 text-3xl md:text-4xl font-bold">
            Welcome back!
          </div>
          <div class="px-3 mb-3 font-bold">
            @{{ Auth.currentProfile.user.username }}!
          </div>

          <div class="px-3 mb-3">
            1. Distribute Kindness Content with APIs
          </div>

          <div class="px-3 mb-3">
            2. International Happiness Research Facility
          </div>
        </div>
      </div>
      <DashboardScene slot="o3d"></DashboardScene>
    </ScissorArea>

  </div>
</template>

<script>
export default {
  props: {
    Auth: {}
  },
  components: {
    ...require('../../webgl').default
  }
}
</script>

<style scoped>
.item-unit{
  height: calc(100% - 78px);
}
.bg-gray{
  background-color: rgba(0,0,0,0.7);
}
</style>
