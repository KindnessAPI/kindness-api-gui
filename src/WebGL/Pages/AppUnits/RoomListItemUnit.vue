<template>
  <div v-if="item" :class="{ 'justify-start': !checkbox, ' justify-between': checkbox }" class="bg-white-opacity flex border-b p-3 border-gray-500 flex cursor-pointer hover:bg-gray-200" @click="onClick(item)">
    <div class="p-1">
      <img :src="item.image" class="h-16 w-16 rounded-full object-cover object-center" alt="">
    </div>
    <div class="py-3 pl-4 h-full">
      <div class="text-left text-lg">{{item.title}}</div>
      <div class="text-left text-sm text-gray-600" v-if="item.subtitle">{{item.subtitle}}</div>
      <div class="text-left text-xs text-gray-600" v-if="item.subtitle2">{{item.subtitle2}}</div>
    </div>
    <div v-if="checkbox" class=" inline-flex justify-end items-center">
      <div>
        <div v-if="item.selected" class="h-8 w-8 bg-green-400 rounded-full"></div>
        <div v-if="!item.selected" class="h-8 w-8 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkbox: {},
    item: {}
  },
  methods: {
    onClick (item) {
      if (this.checkbox) {
        item.selected = !item.selected
        this.$forceUpdate()
        this.$emit('item', item)
      } else {
        this.$emit('item', item)
      }
    }
  }
}
</script>

<style>
.bg-white-opacity{
  background-color: rgba(255, 255, 255, 0.863);
}
</style>
