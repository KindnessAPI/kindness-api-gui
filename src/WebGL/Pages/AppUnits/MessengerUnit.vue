<template>
  <div class="overlay-full border-yellow-500 border">
    <div class="full" v-if="mode === 'mobile'">
      <keep-alive>
        <ViewListChannelUnit :mode="mode" @view="view = $event" @channel="channel = $event"  v-if="view === 'list-channel'"></ViewListChannelUnit>
      </keep-alive>
      <ViewAddChannelUnit @view="view = $event" @channel="channel = $event" v-if="view === 'add-channel'"></ViewAddChannelUnit>
      <ViewChatUnit :key="channel._id" @view="view = $event" :channel="channel" v-if="view === 'chat'"></ViewChatUnit>
    </div>
    <div class="full flex" v-if="mode === 'desktop'">
      <div class="chat-list border-r border-gray-600">
        <ViewListChannelUnit ref="list-channel" @view="desktopView = $event" @channel="channel = $event"></ViewListChannelUnit>
      </div>
      <div class="chat-content">
        <ViewAddChannelUnit @reload-channels="$refs['list-channel'].$emit('reload')" v-if="desktopView === 'add-channel'" @view="desktopView = $event" @channel="channel = $event"></ViewAddChannelUnit>
        <ViewChatUnit :key="channel._id" :back="false" v-if="desktopView === 'chat'" @view="desktopView = $event" :channel="channel" @channel="channel = $event"></ViewChatUnit>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      desktopView: 'list-channel',
      channel: false,
      view: 'list-channel',
      mode: 'mobile'
    }
  },
  watch: {
  },
  mounted () {
    let sync = () => {
      this.mode = 'mobile'
      if (window.innerWidth >= 767) {
        this.mode = 'desktop'
      }
    }
    window.addEventListener('resize', sync, false)
    window.dispatchEvent(new Event('resize'))
  },
  methods: {
  }
}
</script>

<style lang="postcss">
.remain-height{
  height: calc(100% - 51px);
}
.remain-height-chat-diaglogue{
  height: calc(100% - 51px - 60px);
}
.chat-content{
  width: calc(100% - 300px);
}
.chat-list{
  width: 300px;
}
</style>
