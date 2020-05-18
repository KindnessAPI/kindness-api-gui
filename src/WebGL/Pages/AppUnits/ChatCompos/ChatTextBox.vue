<template>
  <div class="w-full h-full bg-gray-200 border-t border-gray-600 flex">
    <input type="text" class="h-full pl-4 pr-4 text-lg input-width" v-model="text" placeholder="Type your messsage here...." @keydown.enter="onSend" />
    <div class="sender-button flex justify-center items-center cursor-pointer bg-white" @click="onSend">
      <div class="p-3 bg-yellow-500 rounded-full">
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
    onSend () {
      if (this.text === '') {
        return
      }
      this.$emit('send', this.text)
      this.text = ''
    }
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
  width: 25px;
  height: 25px;
}
</style>
