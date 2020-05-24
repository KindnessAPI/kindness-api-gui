<template>
  <div>
    <div class="relative">

      <ScissorArea class="scissor-right" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <HowScene slot="o3d"></HowScene>
      </ScissorArea>

      <div class="scissor-left scissor-text py-12 lg:py-32">
        <div class="lg:px-4 max-w-xl mx-auto lg:ml-auto">
          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            TogetherTime.me ? 🤔
          </div>
          <div class="px-3 text-lg mb-10">
            TogetherTime.me is a place for 💁🏼‍♂️YOU💁🏼‍♀️ to share your Kindness, Gratitude, God's Grace and Testimonals with others. We also have an API for 👩🏻‍💻 developers 👨🏼‍💻 to connect and spread Kindness and Gospel to a much wider audience. 📲
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl  font-bold">
            Food & Supply Sharing Network 🥰
          </div>
          <div class="px-3 text-lg mb-2">
            Our system can help people to share and find their extra food 🍎 resources, toilet papers 🧻 and more.
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
            Community Healing 😻
          </div>
          <div class="px-3 text-lg mb-2">
            Building Christ community has always been a treasure for Chrisitans to love one another, to pray and heal each other's depression and loneiness. 🤗
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
            Voice Your Kind Story 💎
          </div>
          <div class="px-3 text-lg mb-2">
            Life is better when we have each other to share our tears and joy, hope, your mental health recovery journey, and praise. 😍
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

<style scoped>
.scissor-text{
}
.scissor-right{
  width: 100vmin;
  height: 100vmin;
}
.scissor-left{
  width: 100%;
  height: 100%;
}

@screen lg {
  .scissor-text{
    color: black;
  }
  .scissor-right{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 50%;
    height: 100%;
    margin-left: 50%;
  }
  .scissor-left{
    /* position: absolute;
    top: 0px;
    left: 0px; */
    width: 50%;
    height: 100%;
  }
}
</style>
