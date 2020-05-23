<template>
  <div class=" bg-gray-100" :class="{ 'sidebar border-r border-gray-500': mode === 'sidebar', 'full': mode === 'full' }">
    <ProfileListItem :checkbox="checkbox" @item="$emit('item', $event)" :item="item" :key="item._id" v-for="item in getPeople()"></ProfileListItem>
  </div>
</template>

<script>
export default {
  components: {
    ...require('../../webgl').default
  },
  props: {
    checkbox: {
      default: false
    },
    items: {},
    mode: {
      default: 'full'
    }
  },
  data () {
    return {
    }
  },
  methods: {
    getPeople () {
      return this.items
    }
  }
}
</script>

<style lang="postcss" scoped>
.sidebar{
  height: 100%;
  width: 285px;
}
</style>
