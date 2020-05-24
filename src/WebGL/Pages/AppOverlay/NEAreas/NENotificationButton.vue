<template>
  <div class="inline">
    <NEIcon :label="`Check Notification`" :color="'gray'" @click="onClick" :badge="node.badge" :img="require('../img/bell.svg')"></NEIcon>
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
      this.$emit('overlayconfig', {
        fromUserID: this.node.value.userID,
        back: 'node-panel'
      })
      this.$emit('overlay', 'notify')
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
