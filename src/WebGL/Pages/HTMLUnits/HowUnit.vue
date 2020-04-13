<template>
  <div>
    <div class="relative py-12 lg:py-32">

      <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <HowScene slot="o3d"></HowScene>
      </ScissorArea>
      <div class="max-w-6xl mx-auto">

        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Kindness API ? 👨🏼‍💻 💒
          <!-- An Gospel Church with API-->
        </div>
        <div class="px-3 text-lg mb-10">
          KindnessAPI is an Gospel Church with an API. It's a place for you to share your Kindness, God's Grace and Testimonals with others. Other website's developer can use our APIs to connect and spread Gospel to a wider audience.
        </div>

        <div class="block lg:flex">
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Food & Supply Sharing Network
              <!-- Why KindnessAPI? 😇 -->
            </div>
            <div class="px-3 text-lg mb-2">
              Our system can help people to share and find their extra food resources, toilet papers and more. 🥰
              <!-- Thank you Gospel 🥰 Thank you Dear God and Dear Jesus. Thank you for your Love and Grace! We love you! -->
            </div>
          </div>
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Helping each other Network
              <!-- Our Goal 🏃🏽‍♂️🏃🏽‍♀️ -->
            </div>
            <div class="px-3 text-lg mb-2">
              Building Christ community has always been a treasure for Chrisitans to help and love one another via volunteering.
              <!-- Our main goal is to invite people to Christianity. Spreading Gospel, Love one another and act with Kindness. -->
            </div>
          </div>
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Share Your Story
              <!-- How do we achieve it? 📱 -->
            </div>
            <div class="px-3 text-lg mb-2">
              Life is better when we have each other to share our tears and joy, testimonals and praise.
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
