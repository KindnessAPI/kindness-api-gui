<template>
  <div class="inline-block">
    <NEIcon :label="`Prayer Room`" :badge="20" :img="require('../img/church.svg')"></NEIcon>
  </div>
</template>

<script>
export default {
  props: {
    node: {},
    graph: {}
  },
  components: {
    // VJsoneditor,
    ...require('../../../webgl').default
  },
  mounted () {
  }
}
</script>

<style lang="postcss">
.badge{
  top: -12px;
  right: -12px;
}
</style>
