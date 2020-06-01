<template>
  <div class="inline">
    <a target="_blank" :href="`https://${node.value.username}.our.togethertime.me`">
      <NEIcon :label="`Visit Mini Site`" :color="'orange'" :img="require('../img/globe.svg')"></NEIcon>
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
