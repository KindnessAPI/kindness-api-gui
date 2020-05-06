<template>
  <div class="inline-block px-4 py-2 rounded-lg border cursor-pointer" @click="() => {
    if(!disabled) {
      $emit('click');
    }
  }" :class="classNames">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      default: false
    },
    color: {
      default: 'green'
    }
  },
  data () {
    return {
      classNames: {
        [`bg-${this.color}-500`]: true,
        [`text-${this.color}-100`]: true,
        [`hover:bg-${this.color}-600`]: true,
        [`opacity-50`]: this.disabled
      }
    }
  }
}
</script>

<style>

</style>
