<template>
  <div class="inline">
    <NEIcon :label="'Send Prayers'" @click="onClick" :badge="0" :img="require('../img/church.svg')"></NEIcon>
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
      // this.$emit('prayFor', this.node.value.userID)
      // this.$emit('prayerID', false)
      this.$emit('overlayconfig', {
        prayFor: this.node.value.userID,
        back: 'node-panel'
      })
      this.$emit('overlay', 'pray-now')
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
