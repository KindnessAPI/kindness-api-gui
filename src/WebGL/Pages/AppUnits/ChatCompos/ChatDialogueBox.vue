<template>
  <div class="p-3">
    <ChatBubbleBox :msg="msg" :key="msg._id" v-for="msg in msgs"></ChatBubbleBox>
  </div>
</template>

<script>
export default {
  components: {
    ...require('../../../webgl').default
  },
  props: {
    msgs: {}
  }
}
</script>

<style>

</style>
