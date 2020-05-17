<template>
  <div class="w-full h-full bg-gray-200 border-t border-gray-600 flex">
    <input type="text" class="h-full pl-4 pr-4 input-width" v-model="text" placeholder="Type your messsage here...." @keydown.enter="$emit('send', text);  text = ''" />
    <div class="sender-button flex justify-center items-center cursor-pointer bg-white" @click="$emit('send', text); text = ''">
      <div class="p-2 bg-gray-200 rounded-full">
        <img src="../icon/send.svg" class="send-icon" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ...require('../../../webgl').default
  },
  data () {
    return {
      text: ''
    }
  },
  methods: {

  }
}
</script>

<style lang="postcss">
.input-width{
  width: calc(100% - 60px);
}
.sender-button{
  width: 60px;
  height: 60px;
}
.send-icon{
  width: 30px;
  height: 30px;
}
</style>
