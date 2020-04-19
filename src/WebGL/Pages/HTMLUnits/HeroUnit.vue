<template>
  <div>
    <div class="">

      <ScissorArea>
        <div slot="dom" class="full">
          <div class="h-min90 lg:h-min70 xl:h-min-30">
          </div>
        </div>
        <HeroScene slot="o3d"></HeroScene>
      </ScissorArea>

      <div class="max-w-xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Make Kindness Louder 📣
        </div>
        <div class="px-3 text-lg mb-2 pb-12">
          At such an unprecedented and unfamiliar time as we are going through today, 🏠 many people are not only dealing with depression and anxiety, but also grieving the loss of loved ones to Co-VID-19. 😢 Moreover, many have lost their jobs or businesses. 🧳 Now, more than ever, people need love and kindness from each other. 😊
        </div>

        <!-- <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          What's KindnessAPI? 👨🏼‍💻
        </div>
        <div class="px-3 text-lg mb-2 pb-12">
          KindnessAPI is like an online Church and... it can also spread Kindness and the Gosepl digitally in API formats. APIs are good for sharing information for other publishing machines scuh as a WebSite and Apps Server. People who want to share their favourite bibles quotes, testimonals across websites / apps are now possible when developers connect their website / apps with KindnessAPI.
        </div> -->
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

<style lang="postcss">
</style>
