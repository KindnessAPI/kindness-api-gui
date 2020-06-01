<template>
  <div class="inline">
    <a target="_blank" href="/dashboard">
      <NEIcon :label="`Site Dashboard`" :color="'orange'" :img="require('../img/dashboard.svg')"></NEIcon>
    </a>
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
      // this.$emit('overlay', 'prayer-outbox')
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
