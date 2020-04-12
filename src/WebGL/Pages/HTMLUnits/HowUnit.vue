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
          What's KindnessAPI? 👨🏼‍💻💒
        </div>
        <div class="px-3 text-lg mb-10">
          KindnessAPI is like an online Church and... it can also spread Kindness and the Gosepl digitally in API formats. APIs are good for sharing information for other publishing machines scuh as a WebSite and Apps Server. People who want to share their favourite bibles quotes, testimonals across websites / apps are now possible when developers connect their website / apps with KindnessAPI.
        </div>

        <div class="block lg:flex">
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Why KindnessAPI? 😇
            </div>
            <div class="px-3 text-lg mb-2">
              Thank you Gospel 🥰 Thank you Dear God and Dear Jesus. Thank you for your Love and Grace! We love you!
            </div>
          </div>
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Our Goal 🏃🏽‍♂️🏃🏽‍♀️
            </div>
            <div class="px-3 text-lg mb-2">
              Our main goal is to invite people to Christianity. Spreading Gospel, Love and Kindness.
            </div>
          </div>
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              How do we achieve it? 📱
            </div>
            <div class="px-3 text-lg mb-2">
              Building christ community has always been a treasure for Chrisitans. Let's do this online too.
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
