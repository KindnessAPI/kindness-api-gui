<template>
  <div>
    <div class="relative">

      <ScissorArea class="scissor-right" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <GospelScene slot="o3d"></GospelScene>
      </ScissorArea>

      <div class="scissor-left scissor-text">
        <div class="h-12 lg:h-32"></div>
        <div class="lg:px-4 max-w-xl mx-auto lg:ml-auto">
          <ThankYouGospelFragment></ThankYouGospelFragment>
          <div class="px-3 text-lg pb-3 font-bold underline">
            <router-link to="/thank-you-gospel">Read more...</router-link>
          </div>

          <!--
            He couldn't find a job.
            Even a low entry profile tech support job doesn't hire him.
            But.
            Lok Lok started practice his favourite computer graphics coding. -->

          <!--
          <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
            What is Lorem Ipsum?
          </div>
          <div class="px-3 text-lg mb-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
          </div> -->

        </div>
        <div class="h-12 lg:h-32"></div>
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

<style scoped lang="postcss">
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
