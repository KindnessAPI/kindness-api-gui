<template>
  <div class="inline">
    <NEIcon :label="`Follow a Friend`" :color="'gray'" @click="onClick" :img="require('../img/add-friend.svg')"></NEIcon>
  </div>
</template>

<script>
// import { Auth } from '../../../../APIs/KA'
export default {
  props: {
    isMe: {},
    node: {},
    graph: {}
  },
  components: {
    // VJsoneditor,
    ...require('../../../webgl').default
  },
  mounted () {
  },
  methods: {
    onClick () {
      // this.$emit('config', {
      //   back: 'node-panel'
      // })
      this.$emit('tab', 'friendship')
    }
  }
}
</script>

<style lang="postcss">
.badge{
  top: -12px;
  right: -12px;
}
</style>
