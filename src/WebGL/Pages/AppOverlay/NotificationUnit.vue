<template>
  <div class="overlay">
    <div class="p-3 bg-yellow-400 leading-6 rounded-t-lg">Notifications</div>
    <div class="p-3 content-height w-full overflow-scroll scrolling-touch relative">
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
    editable: {},
    graph: {},
    node: {},
    userID: {},
    username: {}
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
    isMe () {
      return this.node.value && this.node.value.userID === API.Auth.currentProfile.user.userID
    }
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
