<template>
  <div>
    <div @click="$emit('click')" class="relative p-4 w-24 h-24 m-2  border rounded-lg inline-block hover:opacity-50 cursor-pointer" :class="{ [`border-${color}-600 bg-${color}-200`]: true }">
      <div class="text-center mb-2">
        <img class="inline-block w-8 h-8" :src="img" alt="">
      </div>
      <div class="text-center text-xs leading-3" :class="{ [`text-${color}-600`]: true }">
        {{ label }}
      </div>
      <div v-if="badge" class="absolute badge text-sm p-1 flex justify-center items-center text-white bg-red-600 rounded-full w-8 h-8 text-center select-none">{{ badge > 25 ? '25+' : badge }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      default: 'blue'
    },
    badge: {
      default: false
    },
    label: {
      default: `Send a Prayer`
    },
    img: {
      default: require('../img/church.svg')
    }
  }
}
</script>

<style lang="postcss">
.badge{
  top: -12px;
  right: -12px;
  line-height: 0.875rem;
}
</style>
