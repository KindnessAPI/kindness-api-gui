<template>
  <div class="inline-block px-4 py-2 rounded-lg border cursor-pointer" @click="$emit('click')" :class="classNames">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      default: 'green'
    }
  },
  data () {
    return {
      classNames: {
        [`bg-${this.color}-500`]: true,
        [`text-${this.color}-100`]: true,
        [`hover:bg-${this.color}-600`]: true
      }
    }
  }
}
</script>

<style>

</style>
