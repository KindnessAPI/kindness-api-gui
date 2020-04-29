<template>
  <div>
    <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
      <router-link to="/thank-you-gospel" v-if="$route.fullPath === '/'" class="hover:underline">Thank you Gospel.</router-link>
      <span v-if="$route.fullPath !== '/'">Thank you Gospel.</span>
    </div>
    <div class="px-3 mb-10">
      Thank you Dear God an Dear Jesus for the gift of life and unconditional love. 💓💒
    </div>

    <div class="px-3 mb-2 text-3xl lg:text-xl  font-bold">
      Lok Lok's Life Story
    </div>
    <div class="px-3 pb-8">
      Hello everybody, I'm Lok Lok. 👋🏼 My Christian Church is a thanks giving tribute to Dear God's Grace and Dear Jesus's Mercy.
      This platform is also a give back to the amazing Royal friends I've met online who changed my bad mindset and guided me to Gospel.
      Lok Lok found his life's happiness and purpose again after mental illness. With God, all things are poissible. (Matthew 19:23-30) Now, many of his dreams becomes reality one by one.
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style>

</style>
