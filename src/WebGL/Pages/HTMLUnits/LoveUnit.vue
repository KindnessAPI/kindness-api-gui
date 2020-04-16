<template>
  <div>
    <div class="relative py-12">

      <ScissorArea class="absolute top-0 left-0 scissor-left" style="z-index: -1;">
        <div slot="dom" class="full">
        </div>
        <GospelScene slot="o3d"></GospelScene>
      </ScissorArea>

      <div class="scissor-right scissor-text py-32">
        <div class="lg:pl-12  max-w-xl">
          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            Gospel within our hearts
          </div>
          <div class="px-3 text-lg mb-10">
            Thank you! Thank you!
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl  font-bold">
            What is Lorem Ipsum?
          </div>
          <div class="px-3 text-lg mb-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
            What is Lorem Ipsum?
          </div>
          <div class="px-3 text-lg mb-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>

          <div class="px-3 mb-2 text-3xl lg:text-xl font-bold">
            What is Lorem Ipsum?
          </div>
          <div class="px-3 text-lg mb-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
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

<style scoped lang="postcss">
.scissor-text{
  color: white;
}
.scissor-right{
  width: 100%;
  height: 100%;
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
    width: 50%;
    height: 100%;
    margin-left: 50%;
  }
  .scissor-left{
    width: 50%;
    height: 100%;
  }
}
</style>
