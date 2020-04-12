<template>
  <div>
    <div class="relative pt-12">

      <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <HowScene slot="o3d"></HowScene>
      </ScissorArea>
      <div class="max-w-6xl mx-auto">

        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          If you are....
        </div>

        <div class="block lg:flex">
          <div class="pb-12 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Believer / Pastor / Thought Leader
            </div>
            <div class="px-3 text-lg mb-2">
              We can help you distribute your kindness essential message via our system to different platforms such as websites and apps that are integrated with KindnessAPI.
            </div>
            <div class="px-3 text-lg mb-2">
              We can also help you organize tons of your favourite inspirational and bible quotes.
            </div>
          </div>
          <div class="pb-12 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Day to Day Folks
            </div>
            <div class="px-3 text-lg mb-2">
              You can help out humanity by embedding a Kindness Essential Message Box into your website. So that the reach of Kindness would grow greater.
            </div>
          </div>
          <div class="pb-12 lg:w-1/3">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Developers
            </div>
            <div class="px-3 text-lg mb-2">
              If you are a developer, you can use our simple REST API to integrate or query kindness quotes and bible verses into your App or Website Platform.
            </div>
          </div>
        </div>
      </div>
    </div>
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
