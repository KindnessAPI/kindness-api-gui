<template>
  <div class="full">
    <div class="absolute top-0 left-0 full z-0" ref="mounter"></div>
    <HappyLayout v-if="ready" @scene="scene = $event" @camera="camera = $event"></HappyLayout>
  </div>
</template>

<script>
import { PipeBasic } from '../Reusable'
export default {
  name: 'Home',
  mixins: [PipeBasic]
}
</script>

<style>

</style>
