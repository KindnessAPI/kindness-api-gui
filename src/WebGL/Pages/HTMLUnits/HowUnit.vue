<template>
  <div>
    <div class="relative pt-12">

      <ScissorArea class="absolute top-0 left-0 right-0 bottom-0">
        <div slot="dom" class="full">
        </div>
        <HowScene slot="o3d"></HowScene>
      </ScissorArea>
      <div class="max-w-6xl mx-auto">

        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          If you are a....
        </div>

        <div class="block lg:flex">
          <div class="pb-12 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Pastor or Thought Leader
            </div>
            <div class="px-3 text-lg mb-2">
              We can help you distribute your essential message through our system to different platforms such as websites, or apps which integrated with KindnessAPI.
            </div>
            <div class="px-3 text-lg mb-2">
              We can also help you organize tons of micro-content using hashtags or folders.
            </div>
          </div>
          <div class="pb-12 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Day to day folks
            </div>
            <div class="px-3 text-lg mb-2">
              You can help out humanity by embedding a Kindness Essential Message Box into your website so that you have a wider reach of audience to Kindness and contents from the Bible.
            </div>
          </div>
          <div class="pb-12 lg:w-1/3">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Developer...
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
