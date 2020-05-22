<template>
  <div class="overlay">
    <div class="p-3 bg-yellow-400 leading-6 rounded-t-lg">Notifications</div>
    <div class="p-3 content-height w-full overflow-y-scroll overflow-x-hidden scrolling-touch relative">
      <div class="h-64">123</div>
      <div class="h-64">123</div>
      <div class="h-64">123</div>
      <div class="h-64">123</div>
    </div>
  </div>
</template>

<script>
import * as API from '../../../APIs/KA.js'

export default {
  props: {
    me: {},
    graph: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      tab: 'profile',
      API
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="postcss">
.content-height{
  height: calc(100% - 3rem);
}
</style>
