<template>
  <div class="h-full w-full">
    <div class="msg-header text-lg py-3 text-center bg-yellow-500 flex justify-between">
      <div class="w-1/5 text-left pl-3 flex items-center">
        <span class="inline-block" v-if="back"  @click="$emit('view', 'list-channel')">
          <img src="./icon/left.svg" alt="">
        </span>
      </div>
      <div class="w-3/5">{{ channel.title }}</div>
      <div class="w-1/5 text-right pr-3"></div>
    </div>
    <div class="msg-body-list remain-height-chat-diaglogue bg-white  overflow-x-hidden overflow-y-auto rounded-b-lg pb-4" ref="scroller">
      <ChatDialogueBox :key="channel._id + 'dialogue'" :msgs="msgs.slice().sort(this.sortMsgs)"></ChatDialogueBox>
    </div>
    <div class="sender">
      <ChatTextBox @send="$emit('send-text', $event)"></ChatTextBox>
    </div>
  </div>
</template>

<script>
import { LamdaClient, getWS, Auth, Message } from '../../../APIs/KA'
export default {
  props: {
    back: {
      default: true
    },
    channel: {}
  },
  components: {
    ...require('../../webgl.js').default
  },
  data () {
    return {
      msgs: []
    }
  },
  watch: {
    channel () {
      this.msgs = []
    }
  },
  async mounted () {
    await this.onSetup()
  },
  methods: {
    async onSetup () {
      this.socket = new LamdaClient({
        url: getWS(),
        token: Auth.currentProfile.jwt,
        roomID: this.channel._id,
        nickname: Auth.currentProfile.user.username
      })

      this.$on('close-socket', () => {
        this.socket.close()
      })

      this.socket.on('text', (data) => {
        // let html = `<pre>${detail.type} - ${JSON.stringify(detail)}</pre>`
        // console.log(html)
        this.msgs.push(data.data)
        this.$emit('scroll-to-bottom')
      })

      this.$on('scroll-to-bottom', () => {
        let element = this.$refs['scroller']
        this.$nextTick(() => {
          element.scrollTop = element.scrollHeight
        })
      })
      this.$emit('scroll-to-bottom')

      this.$on('send-text', (v) => {
        this.socket.sendText({ text: v })
      })

      this.socket.on('online', (data) => {
        // let html = `<pre>me: ${socket.nickname} - ${JSON.stringify(detail)}</pre>`
        // console.log(html)
        console.log(data)
      })

      console.log(this.channel._id)
      let msgs = await Message.getMyRoomMessage({ channelID: this.channel._id, pageAt: 0, perPage: 50 })
      this.msgs = msgs
      this.$emit('scroll-to-bottom')
      // this.msgs = [
      //   ...this.msgs,
      //   ...msgs
      // ].sort(this.sortMsgs)
    },
    sortMsgs (a, b) {
      let crA = (new Date(a.created_at)).getTime()
      let crB = (new Date(b.created_at)).getTime()
      if (crA > crB) {
        return 1
      } else if (crA < crB) {
        return -1
      } else {
        return 0
      }
    }
  },
  beforeDestroy () {
    this.$emit('close-socket')
  }
}
</script>

<style scoped>
.sender{
  height: 60px;
}
</style>
