<template>
  <div>
    <div class="pt-3">
      <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
        Making Kindness Louder at Scale
      </div>
      <div class="px-3 text-lg mb-2">
        At this age, a lot of people are depressed and grieving because they lost their loved ones to Co-VID-19 or they lost their job or business. People need kindness and love from each other, and encouargement from Christ community as well.
      </div>
      <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
        Why do we make KindessAPI, when there's social media?
      </div>
      <div class="px-3 text-lg mb-2">
        It's easy to encourage others on social media, but the amount of audience is quite low due to attention fatigue and the excessive amount of content in social media feed.
        API is a good way to spread kindness because it doesn't have ads or unrelated content and the Kindness content can be integrated to other websites or apps.
      </div>
    </div>

    <ScissorArea>
      <div slot="dom" class="full">
        <div class="h-min90 lg:h-min60 xl:h-min-30">
        </div>
      </div>
      <HeroScene slot="o3d"></HeroScene>
    </ScissorArea>

    <div class="pb-3">
      <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
        If you want to encourage others...
      </div>
      <div class="px-3 text-lg mb-2">
        We can help you distirubte your essential message through our system to different places such as different websites, platforms or apps which integrated with KindnessAPI.
      </div>
      <div class="px-3 text-lg mb-2">
        We can also help you organise tons of micro-content with hashtags or folders.
      </div>
    </div>
    <div class="pb-3">
      <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
        If you want to Spread the Kindness to a wider audience....
      </div>
      <div class="px-3 text-lg mb-2">
        You can help out humanity by embeding a Kindness Essential Message Box into your website, so that we have a wider reach of audience of Kindness and Bible.
      </div>
    </div>
    <div class="pb-3">
      <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
        If you're a developer...
      </div>
      <div class="px-3 text-lg mb-2">
        If you're a developer, you can use our simple REST API to integrate or query kindness quotes into your App or Website Platform.
      </div>
    </div>

    <!--  -->
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
