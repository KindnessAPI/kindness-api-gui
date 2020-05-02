<template>
  <div class="item-unit h-full w-full">
    <ScissorArea class="w-full h-full focus:outline-none" style="z-index: -1;">
      <div slot="dom" class="full bg-gray pt-3 focus:outline-none">

        <div class="text-white px-3">
          <div class="px-3 mb-3 text-3xl md:text-4xl font-bold">
            Welcome back!
          </div>
          <div class="px-3 mb-3 font-bold">
            @{{ Auth.currentProfile.user.username }}!
          </div>

          <div class="px-3 mb-3 underline">
            <router-link to="/prayer-room">1. Share your Prayers / Stories (work in progress)</router-link>
          </div>

          <div class="px-3 mb-3">
            2. International Chrsit Community and Fostering Friendship. (work in progress)
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
  height: calc(100% - 60px);
}
.bg-gray{
  background-color: rgba(0,0,0,0.7);
}
</style>
