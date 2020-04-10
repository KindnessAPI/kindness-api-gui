<template>
  <div>
    <div class="">

      <ScissorArea>
        <div slot="dom" class="full">
          <div class="h-min90 lg:h-min60 xl:h-min-30">
          </div>
        </div>
        <HeroScene slot="o3d"></HeroScene>
      </ScissorArea>

      <div class="max-w-6xl mx-auto">
        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Make Kindness Louder at Scale
        </div>
        <div class="px-3 text-lg mb-2 pb-12">
          At such an unprecedented and unfamiliar time as we are going through today, many people are not only dealing with depression and anxiety, but also grieving the loss of loved ones to Co-VID-19. Moreover, many have lost their jobs or businesses. Now, more than ever, people need love and kindness from each other, and encouragement from The Christ community as well.
        </div>
        <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
          Why do we make KindessAPI, when there's social media?
        </div>
        <div class="px-3 text-lg mb-2 pb-12">
          It is easy to encourage others on social media, but the audience limited, due to attention fatigue due to the bombardment of negative content on the social media feed.
          API is a good way to spread kindness because it doesn't have ads or unrelated content, and also because the Kindness content can be integrated into other websites or apps.
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

<style lang="postcss">
</style>
