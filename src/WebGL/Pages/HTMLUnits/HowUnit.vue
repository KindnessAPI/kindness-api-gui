<template>
  <div class="lg:border-black lg:border-b">
    <div class="">

        <div class="flex flex-col lg:flex-row">

          <div class="lg:w-1/2 relative lg:border-t lg:border-r lg:border-black">
            <ScissorArea class="lg:absolute top-0 left-0 right-0 bottom-0 h-min100 lg:h-auto" style="z-index: -1;">
              <div slot="dom" class="full">
              </div>
              <HeroScene slot="o3d"></HeroScene>
            </ScissorArea>
            <!--  -->
          </div>
          <div class="lg:w-1/2 relative border-t border-black">
            <!-- <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
              <div slot="dom" class="full">
              </div>
              <HowScene slot="o3d"></HowScene>
            </ScissorArea> -->
            <div class="px-3 max-w-xl mx-auto  py-12 lg:py-32 xl:py-64">
              <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
                KindnessAPI 🤔
              </div>

              <div class="px-3 text-lg mb-10">
                KindnessAPI is ✝️ a digital Christian Church 💒 . It's a place for 💁🏼‍♂️ YOU 💁🏼‍♀️ to share your Kindness, God's Grace and Testimonals with others. We also have an API for 👩🏻‍💻 developers 👨🏼‍💻 to connect and spread Kindness and Gospel to a much wider audience. 📲
              </div>

              <!-- <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
                Make Kindness Louder 📣
              </div>

              <div class="px-3 text-lg">
                At such an unprecedented and unfamiliar time as we are going through today, 🏠 many people are not only dealing with depression and anxiety, but also grieving the loss of loved ones to Co-VID-19. 😢 Moreover, many have lost their jobs or businesses. 🧳 Now, more than ever, people need love and kindness from each other. 😊
              </div> -->
            </div>
          </div>
        </div>

        <!-- -->

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
