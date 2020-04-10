<template>
  <div>
    <div class="relative py-32">
      <div class="max-w-6xl mx-auto">
        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Why do we make KindessAPI, when there's social media?
        </div>
        <div class="px-3 text-lg mb-2">
          It is easy to encourage others on social media, but the audience limited, due to attention fatigue due to the bombardment of negative content on the social media feed.
          API is a good way to spread kindness because it doesn't have ads or unrelated content, and also because the Kindness content can be integrated into other websites or apps.
        </div>

        <div class="block lg:flex pt-12">
          <div class="pb-12 lg:w-1/3 lg:pr-3">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              If you want to encourage others...
            </div>
            <div class="px-3 text-lg mb-2">
              We can help you distribute your essential message through our system to different platforms such as websites, or apps which integrated with KindnessAPI.
            </div>
            <div class="px-3 text-lg mb-2">
              We can also help you organize tons of micro-content using hashtags or folders.
            </div>
          </div>
          <div class="pb-12 lg:w-1/3 lg:pr-3">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              If you want to Spread the Kindness to a wider audience....
            </div>
            <div class="px-3 text-lg mb-2">
              You can help out humanity by embedding a Kindness Essential Message Box into your website so that you have a wider reach of audience to Kindness and contents from the Bible.
            </div>
          </div>
          <div class="pb-12 lg:w-1/3">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              If you're a developer...
            </div>
            <div class="px-3 text-lg mb-2">
              If you are a developer, you can use our simple REST API to integrate or query kindness quotes and bible verses into your App or Website Platform.
            </div>
          </div>
        </div>
      </div>

      <ScissorArea class="absolute top-0 left-0 w-full h-full">
        <div slot="dom" class="full">
        </div>
        <HowScene slot="o3d"></HowScene>
      </ScissorArea>
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
