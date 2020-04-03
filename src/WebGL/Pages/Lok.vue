<template>
  <div class="full">
    <div class="absolute top-0 left-0 full z-0" ref="mounter"></div>
    <BallerLayout v-if="ready" @scene="scene = $event" @camera="camera = $event"></BallerLayout>
  </div>
</template>

<script>
import { PipeBasic } from '../Reusable'
export default {
  name: 'Lok',
  mixins: [PipeBasic]
}
</script>

<style>

</style>
