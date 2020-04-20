<template>
  <div>
    <div class="relative py-12 lg:py-32">

      <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <HowScene slot="o3d"></HowScene>
      </ScissorArea>
      <div class="max-w-xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          KindnessAPI ? 🤔
        </div>

        <div class="px-3 text-lg mb-10">
          KindnessAPI is ✝️ a Gospel Church 💒 . It's a place for 💁🏼‍♂️ YOU 💁🏼‍♀️ to share your Kindness, God's Grace and Testimonals with others. We also have an API for 👩🏻‍💻 developers 👨🏼‍💻 to connect and spread Kindness and Gospel to a much wider audience. 📲
        </div>

        <div class="block lg:flex">
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Voice Your Kind Story 💎
            </div>
            <div class="px-3 text-lg mb-2">
              Life is better when we have each other to share our tears and joy, hope, your mental health recovery journey, and praise. 😍
            </div>
            <div class="px-3 text-lg mb-2">
              (Under development)
            </div>
          </div>
          <div class="pb-10 lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Community Healing 😻
            </div>
            <div class="px-3 text-lg mb-2">
              Building Christ community has always been a treasure for Chrisitans to love one another, to pray and heal each other's depression and loneiness. 🤗
            </div>
            <div class="px-3 text-lg mb-2">
              (Under development)
            </div>
          </div>
          <div class="lg:w-1/3 lg:pr-6">
            <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
              Voice Your Kind Story 💎
            </div>
            <div class="px-3 text-lg mb-2">
              Life is better when we have each other to share our tears and joy, hope, your mental health recovery journey, and praise. 😍
            </div>
            <div class="px-3 text-lg mb-2">
              (Under development)
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
