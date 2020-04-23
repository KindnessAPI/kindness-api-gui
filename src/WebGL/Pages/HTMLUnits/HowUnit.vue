<template>
  <div>
    <div class="relative py-12 lg:py-32">

      <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <HowScene slot="o3d"></HowScene>
      </ScissorArea>
      <div class="max-w-xl lg:max-w-6xl xl:max-w-6xl mx-auto">
        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          KindnessAPI 🤔
        </div>

        <div class="px-3 text-lg mb-10">
          KindnessAPI is ✝️ a digital Christian Church 💒 . It's a place for 💁🏼‍♂️ YOU 💁🏼‍♀️ to share your Kindness, God's Grace and Testimonals with others. We also have an API for 👩🏻‍💻 developers 👨🏼‍💻 to connect and spread Kindness and Gospel to a much wider audience. 📲
        </div>

        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Make Kindness Louder 📣
        </div>
        <div class="px-3 text-lg">
          At such an unprecedented and unfamiliar time as we are going through today, 🏠 many people are not only dealing with depression and anxiety, but also grieving the loss of loved ones to Co-VID-19. 😢 Moreover, many have lost their jobs or businesses. 🧳 Now, more than ever, people need love and kindness from each other. 😊
        </div>

        <!-- <div class="block lg:flex">
          <div class="lg:w-1/3 lg:pr-6">
            <div class="px-3 pb-3 text-3xl lg:text-xl font-bold">
              <router-link class="hover:underline" to="/kindness-river">Kindness River💧✨</router-link>
            </div>
            <div class="px-3 text-lg pb-3">
              Kindness is like water. Water is life. We need it everyday to stay mentally healthy. With massive amount of stories, we can make a flowing river of Kindness. 🏄🏻‍♂️ 😆
            </div>
            <div class="px-3 text-lg pb-3">
              (Under development)
            </div>
            <div class="h-5 lg:h-0"></div>
          </div>

          <div class="lg:w-1/3 lg:pr-6">
            <div class="px-3 pb-3 text-3xl lg:text-xl font-bold">
              Community Healing ⛪️ 😻
            </div>
            <div class="px-3 text-lg pb-3">
              Building Christ community has always been a treasure for Chrisitans to love one another, to pray and be there for each other's depression and loneiness. 🤗
            </div>
            <div class="px-3 text-lg pb-3">
              (Under development)
            </div>
          </div>
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

<style>
</style>
