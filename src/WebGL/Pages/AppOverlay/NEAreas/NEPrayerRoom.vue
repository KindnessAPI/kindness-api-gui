<template>
  <div class="inline-block">
    <NEIcon :label="isMe ?  `Prayer Room` : `Send Prayers`" @click="onClick" :badge="0" :img="require('../img/church.svg')"></NEIcon>
  </div>
</template>

<script>
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
    this.loadBadge()
  },
  methods: {
    loadBadge () {

    },
    onClick () {
      if (this.isMe) {
        this.$router.push(`/prayer-room`)
      } else {
        this.$router.push(`/prayer-room?prayFor=${this.node.value.userID}`)
      }
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
