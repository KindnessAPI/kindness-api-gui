<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" :style="{
      zIndex: -1,
    }" ref="mounter"></div>

    <div v-show="!openMenu" class="full relative">
      <div class="topnavbar">
        <TopNavBar @menu="openMenu = !openMenu" ></TopNavBar>
      </div>

      <!--
      <ScissorArea
      class="webgl-bg"
      :key="'webgloading'"
      v-if="mainArea === 'loading'"
      >
        <div
          slot="dom"
          class="full flex justify-center items-center text-3xl text-white"
        >
          <div>
            Traversing Galaxy
            <br/>
            Please wait... ⏱
          </div>
        </div>
        <StarFlowScene slot="o3d">
        </StarFlowScene>
      </ScissorArea>
      -->

      <div :style="{
        backgroundImage: `url(${loadingBG}), url(${readyBG})`,
      }"></div>

      <transition name="fade">
        <div class="simple-bg"
          v-if="mainArea === 'loading'"
          :key="loadingBG + '__loading'"
          :style="{
            backgroundColor: '#000000',
            backgroundImage: `url(${loadingBG})`,
            backgroundSize:'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat no-repeat'
          }"
          >
        </div>
      </transition>

      <!-- <div class="simple-bg pointer-events-none" v-if="mainArea === 'loading'">
        <ScissorArea class="w-full h-full focus:outline-none" style="z-index: -1;">
          <div slot="dom" class="full bg-gray pt-3 focus:outline-none">
          </div>
          <StarFlowScene slot="o3d"></StarFlowScene>
        </ScissorArea>
      </div> -->

      <transition name="fade">
        <div class="simple-bg pointer-events-none"
          v-if="mainArea === 'traverse'"
          :key="readyBG + '__ready'"
          :style="{
            backgroundColor: 'transparent',
            backgroundImage: `url(${readyBG})`,
            backgroundSize:'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat no-repeat'
          }"
          >
        </div>
      </transition>

      <div class="simple-bg pointer-events-none" v-if="mainArea === 'starmap-loaded'">
        <ScissorArea class="w-full h-full focus:outline-none" style="z-index: -1;">
          <div slot="dom" class="full bg-gray pt-3 focus:outline-none">
          </div>
          <!-- <component :is="transitionScene" slot="o3d"></component> -->
          <DashboardScene slot="o3d"></DashboardScene>
        </ScissorArea>
      </div>

      <!-- <div class="relative minus-navbar-height h-full w-full focus:outline-none">
        <ScissorArea class="w-full h-full focus:outline-none" style="z-index: -1;">
          <div slot="dom" class="full">
          </div>
          <TraverseScene
            slot="o3d"
            :btns="btns"
            @home="onGoHome"
            @view="onViewProfile"
            @node-click="onNodeClick"
            @node-drag="onNodeDrag"
            :graph="graph"
            @mail="onMail"
            ref="edge-node-2"
            >
          </TraverseScene>
        </ScissorArea>
      </div> -->

      <TraverseNodeEdgeUnit
      :btns="btns"
      @home="onGoHome"
      @view="onViewProfile"
      @node-click="onNodeClick"
      @node-drag="onNodeDrag"
      :graph="graph"
      @mail="onMail"
      @notify="onNotify"
      :run="overlay === false"
      ref="edge-node"
      >
      </TraverseNodeEdgeUnit>

      <transition name="fade">
        <div v-if="mainArea === 'loading'" class="overlay-loading pointer-events-none">
          <div
            class="full flex justify-center items-center text-xl text-white"
          >
            <div class="p-6 rounded-lg text-white bg-translucent select-none text-center">
              ✨ Loading Star Map ✨
              <br/>
              @{{ queryUsername }}
            </div>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="mainArea === 'starmap-loaded'" class="overlay-loading pointer-events-none">
          <div
            class="full flex justify-center items-center text-xl text-white"
          >
            <div class="p-6 rounded-lg text-white bg-translucent mx-3 select-none">
              ✨ Star Map Loaded ✨
            </div>
          </div>
        </div>
      </transition>

      <!--
      <div v-if="mainArea === 'not-ready'" class="overlay-loading">
        <div
          class="full flex justify-center items-center text-xl text-white"
        >
          <div class="p-6 rounded-lg text-white bg-translucent">
            Profile Not Ready
          </div>
        </div>
      </div>
      -->

      <!-- <div v-if="overlay" @click="overlay = false" class="overlay-bg"></div> -->
      <transition name="fadefast">
        <div v-if="overlay" @click="overlay = false" class="overlay-close"></div>
      </transition>

      <transition name="flyin">
        <NodePanelUnit
          @close="overlay = false"
          @reload="onReload"
          :editable="isMe"
          :node="currentNode"
          :graph="graph"
          :userID="queryUserID"
          :username="queryUsername"
          @overlay="overlay = $event"
          @overlayconfig="overlayconfig = $event"
          @notify="prepareNotifs"
          v-if="currentNode && graph && overlay === 'node-panel'"
        ></NodePanelUnit>
      </transition>

      <transition name="flyin">
        <!-- <keep-alive> -->
          <MessengerUnit
            :key="me.userID"
            @close="overlay = false"
            @reload="onReload"
            :editable="isMe"
            :graph="graph"

            :userID="me.userID"
            :username="me.username"
            v-if="overlay === 'messenger'"
          ></MessengerUnit>
        <!-- </keep-alive> -->
      </transition>

      <transition name="flyin">
        <!-- <keep-alive> -->
          <NotificationUnit
            :key="me.userID"
            @close="overlay = false"
            @reload="onReload"
            @overlay="overlay = $event"
            @prayerID="prayerID = $event"
            @notify="prepareNotifs"
            @overlayconfig="overlayconfig = $event"
            :graph="graph"
            :overlayconfig="overlayconfig"
            :me="me"
            v-if="overlay === 'notify'"
          ></NotificationUnit>
        <!-- </keep-alive> -->
      </transition>

      <transition name="flyin">
        <!-- <keep-alive> -->
          <PrayerRoomOverlayUnit
            :key="me.userID"
            @close="overlay = false"
            @reload="onReload"
            @overlay="overlay = $event"
            :graph="graph"
            :prayerID="prayerID"
            :prayFor="prayFor"
            :me="me"
            :overlayconfig="overlayconfig"
            v-if="overlay === 'prayer'"
          ></PrayerRoomOverlayUnit>
        <!-- </keep-alive> -->
      </transition>

      <transition name="flyin">
        <!-- <keep-alive> -->
          <PrayerRoomComposeOverlay
            :key="me.userID"
            @close="overlay = false"
            @reload="onReload"
            @overlay="overlay = $event"
            :graph="graph"
            :prayerID="prayerID"
            :prayFor="prayFor"
            :me="me"
            :overlayconfig="overlayconfig"
            v-if="overlay === 'pray-now'"
          ></PrayerRoomComposeOverlay>
        <!-- </keep-alive> -->
      </transition>

      <transition name="flyin">
        <!-- <keep-alive> -->
          <PrayerRoomInboxOverlay
            :key="me.userID"
            @close="overlay = false"
            @reload="onReload"
            @overlay="overlay = $event"
            :graph="graph"
            :prayerID="prayerID"
            :prayFor="prayFor"
            :me="me"
            :overlayconfig="overlayconfig"
            v-if="overlay === 'prayer-inbox'"
          ></PrayerRoomInboxOverlay>
        <!-- </keep-alive> -->
      </transition>

      <transition name="circlein">
        <div v-if="overlay" @click="overlay = false" class="overlay-close-btn">
          <img src="./icon/close.svg" class="cursor-pointer close-icon bg-white p-2 rounded-full" alt="Close" title="close">
        </div>
      </transition>

    </div>
    <FullMenuBar v-show="openMenu" @close="openMenu = false"></FullMenuBar>
  </div>
</template>

<script>
import { PipeScissor, makeScrollBox } from '../Reusable'
import { Auth, Graph, LambdaClient, getWS, getID, Profile, Notification } from '../../APIs/KA'
import { Howl } from 'howler'
var dingding = new Howl({
  src: [require('./mp3/dingding.mp3')]
})

// import axios from 'axios'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
      // transitionSceneList: [
      //   'DashboardScene',
      //   // 'StarFlowScene',
      //   'RiverFieldScene',
      //   'FallScene',
      //   'RiseScene'
      //   // 'MotherBoardScene'
      // ],
      // transitionScene: 'FallScene',
      bg: {
        stars: require('./AppUnits/hdri/sky-space-milky-way-stars-110854.jpg'),
        earth: require('./AppUnits/hdri/astronomy-atmosphere-earth-exploration-220201.jpg'),
        galaxy: require('./AppUnits/hdri/sky-space-dark-galaxy-2150.jpg')
      },
      overlayconfig: false,
      prayerID: false,
      prayFor: false,
      bellButton: {
        place: 'tr',
        badge: 0,
        text: `🔔`,
        event: 'notify'
      },
      myNode: false,
      allReady: false,
      profile: false,
      layouts: {},
      currentNode: false,
      mainArea: 'loading',
      btns: [],
      escFncs: [],
      username: false,
      userID: false,
      overlay: false,
      graph: false,
      Auth,
      chatButton: false,
      openMenu: false,
      origColor: '',
      bgColor: '#fafafa',
      notifications: false
    }
  },
  watch: {
    mainArea () {
      window.dispatchEvent(new Event('resize'))
      // this.transitionScene = this.transitionSceneList[Math.floor(this.transitionSceneList.length * Math.random())]
      // setTimeout(() => {
      //   window.dispatchEvent(new Event('resize'))
      // }, 100)
    },
    overlay () {
      // this.transitionScene = this.transitionSceneList[Math.floor(this.transitionSceneList.length * Math.random())]
      if (this.overlay) {
        this.escFncs.push(() => {
          this.overlay = false
        })
      }
      if (this.overlay) {
        this.base.isActiveRender = false
      } else {
        this.base.isActiveRender = true
      }
    },
    queryUserID () {
      // this.transitionScene = this.transitionSceneList[Math.floor(this.transitionSceneList.length * Math.random())]
      this.onReset()
      this.onInit()
    }
  },
  computed: {
    me () {
      return Auth.currentProfile.user
    },
    loadingBG () {
      if (this.profile && this.profile.loadingImg) {
        return this.profile.loadingImg
      }
      return this.bg.stars
    },
    readyBG () {
      if (this.profile && this.profile.bgImg) {
        return this.profile.bgImg
      }
      return this.bg.stars
    },
    queryUserID () {
      return this.$route.params.userID
    },
    queryUsername () {
      return this.$route.params.username
    },
    isMe () {
      return Auth.currentProfile.user.userID === this.queryUserID
    }
  },
  methods: {
    onNotify () {
      this.overlayconfig = {}
      this.overlay = 'notify'
    },
    onMail () {
      this.overlay = 'messenger'
    },
    onViewProfile () {
      let node = this.graph.nodes.find(e => e.userID === this.queryUserID && e.type === 'user')
      this.onNodeClick(node)
    },
    onGoHome () {
      this.$router.push(`/profile/${Auth.currentProfile.user.username}/${Auth.currentProfile.user.userID}`)
      this.overlay = false
    },
    onSetupBtns () {
      this.btns = []
      if (!this.isMe) {
        this.btns.push({
          place: 'tr',
          text: `🏡`,
          event: 'home'
        })
      }

      this.btns.push({
        text: `@${this.queryUsername}`,
        event: 'view'
      })

      this.btns.push(this.bellButton)

      // this.$emit('update-bell')

      // this.chatButton = {
      //   place: 'tr',
      //   type: 'mail',
      //   badge: 1,
      //   text: `💬`,
      //   event: 'mail'
      // }
      // this.btns.push(this.chatButton)
    },
    onReset () {
      this.btns = []
      this.graph = {
        nodes: [],
        links: []
      }
      this.$emit('onReset')
    },
    onNodeDrag (node) {
      this.currentNode = node
      if (node.type === 'traverse') {
        if (node.value.username !== this.queryUsername) {
          this.$router.push(`/profile/${node.value.username}/${node.value.userID}`)
          this.mainArea = 'loading'
          this.overlay = false
        } else {
          this.mainArea = 'starmap-loaded'
          setTimeout(() => {
            this.mainArea = 'traverse'
          }, 3000)
        }
      } else {
        this.mainArea = 'starmap-loaded'
        setTimeout(() => {
          this.mainArea = 'traverse'
        }, 3000)
      }
    },
    onNodeClick (node) {
      // if (node.type === 'traverse') {
      //   if (node.value.username !== this.queryUsername) {
      //     this.$router.push(`/profile/${node.value.username}/${node.value.userID}`)
      //   } else {
      //     this.overlay = 'node-panel'
      //   }
      // } else {
      //   this.overlay = 'node-panel'
      // }

      this.currentNode = node
      this.overlay = 'node-panel'
    },
    async onReload () {
      this.mainArea = 'loading'
      await this.prepareProfile()
      await this.prepareGraph()
      await this.prepareNotifs()
    },
    async prepareNotifs () {
      this.notifications = await Notification.getMyNotifications({ pageAt: 0, perPage: 50 })

      if (this.queryUserID === Auth.currentProfile.user.userID) {
        let badgeInfo = this.notifications.reduce((acc, notif) => {
          acc[notif.fromUserID] = acc[notif.fromUserID] || 0
          if (!notif.read) {
            acc[notif.fromUserID]++
          }
          return acc
        }, {})
        for (let kn in badgeInfo) {
          this.updateBadgeByUserID({ userID: kn, badge: badgeInfo[kn] })
        }
      }
      this.bellButton.text = `🔔 ${this.notifications.filter(e => !e.read).length}`
    },
    async prepareGraph () {
      this.mainArea = 'loading'
      let graphData = await Graph.getUserGraph({ userID: this.queryUserID })
      let needToReload = false
      let brokenEdgeIDs = []
      for (let link of graphData.links) {
        if ((!graphData.nodes.some(n => n._id === link.source) || !graphData.nodes.some(n => n._id === link.target))) {
          // await Graph.removeEdgeByID({ edgeID: link._id })
          brokenEdgeIDs.push(link._id)
          // graphData.links.splice(graphData.links.findIndex(lnk => lnk._id === link._id), 1)
          console.log('Broken Edge Found')
          needToReload = true
        }
      }
      if (needToReload) {
        await Graph.removeEdgesByIDList({ list: brokenEdgeIDs })
        graphData = await Graph.getUserGraph({ userID: this.queryUserID })
      }

      let userIDs = graphData.nodes.filter(e => e.value && e.value.userID).map(e => e.value.userID)
      let profiles = await Profile.getProfileByUserIDList({ list: userIDs })

      // assign profile pics to nodes
      graphData.nodes
        .filter(e => e.type === 'user' || e.type === 'traverse')
        .filter(e => e.value && e.value.userID)
        .forEach(e => {
          let profile = profiles.find(u => u.userID === e.value.userID)
          if (profile) {
            e.name = profile.displayName
            e.img = profile.photoImg
          }
        })

      this.graph = graphData
      this.mainArea = 'traverse'
    },
    updateBadgeByUserID ({ userID, badge }) {
      let node = this.graph.nodes.find(n => n.type === 'traverse' && n.value.userID === userID)
      if (node) {
        node.badge = badge
        this.updateBadgeByNode(node)
      }
    },
    updateBadgeByNode (node) {
      node.badge = node.badge || 0
      this.$refs['edge-node'].$emit('badge', node)
    },
    async makeMySocket () {
      let myBell = new LambdaClient({
        url: getWS(),
        token: Auth.currentProfile.jwt,
        roomID: Auth.currentProfile.user.userID,
        nickname: Auth.currentProfile.user.username + '@' + getID()
      })

      myBell.on('channel-update', (event) => {
        this.$root.$emit('channel-update', event.data)
      })

      myBell.on('prayer-update', (event) => {
        this.$root.$emit('prayer-update', event.data)
        console.log('prayer-update', event)
        this.prepareNotifs()
        dingding.play()
      })

      this.$on('onReset', () => {
        myBell.close()
      })

      // myBell.on('update-user-badge', (event) => {
      //   let { userID, badge } = event.data
      //   this.updateBadgeByUserID({ userID, badge })
      // })
    },
    async prepareProfile () {
      this.profile = await Profile.provideProfile({ userID: this.queryUserID })
      await Graph.provideUserNode({ userID: this.queryUserID })
    },
    async onInit () {
      this.mainArea = 'loading'
      this.onReset()
      this.makeMySocket()
      await this.prepareProfile()
      await this.prepareGraph()
      await this.prepareNotifs()
      this.onSetupBtns()
      this.mainArea = 'traverse'
    }
  },
  async mounted () {
    this.$watch('openMenu', () => {
      window.dispatchEvent(new Event('resize'))
    })
    this.scrollBox = makeScrollBox({ dom: window, base: this.base })

    await this.onInit()

    window.addEventListener('keydown', (evt) => {
      if (evt.keyCode === 27) {
        this.$emit('esc')
      }
    })

    window.addEventListener('reload-graph', () => {
      this.onReload()
    })

    this.$on('esc', () => {
      let popped = this.escFncs.pop()
      if (popped) {
        popped()
      }
    })

    this.origColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = this.bgColor

    this.allReady = true
  },
  beforeDestroy () {
    this.onReset()
    document.body.style.backgroundColor = this.origColor
  }
}
</script>

<style lang="postcss" scoped>
.simple-bg{
  position: absolute;
  top: 60px;
  left: 0px;
  width: 100%;
  height: calc(100% - 60px);
}

.overlay-bg{
  position: absolute;
  top: 60px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 10;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat no-repeat;
  background-image: url('./AppOverlay/img/mb-lines-svg-2.svg');
  background-color: rgba(0, 0, 0, 0.61);
  opacity: 0.6;
}
.overlay-close {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 11;
  background-color: rgba(0, 0, 0, 0.589);
}
.overlay-loading{
  position: absolute;
  top: 60px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 12;
}
.overlay-close-btn {
  position: absolute;
  bottom: 15px;
  /* right: 20px; */
  /* background-color: rgba(0,0,0,0.75); */
  z-index: 12;
  width: 50px;
  right: calc(50% - 50px * 0.5);
}
@screen md {
  .overlay-close-btn{
    top: 15px;
    bottom: inherit;
    /* left: 20px; */
    /* right: inherit; */
  }
}
.close-icon{
  width: 50px;
  height: 50px;
  box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.6);
}

.scroll-area{
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 80px;
  z-index: 12;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  overflow: hidden;

  transform: perspective(100vmax) translateZ(2px);
  /* transform: perspective(100vmax) translateZ(1px); */
}

.overlay-full {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 80px;
  z-index: 16;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  transform: perspective(100vmax) translateZ(2px);
  overflow: hidden;
}

@screen md {
  .overlay {
    position: absolute;
    top: 80px;
    left: calc(50% - 28rem * 0.5);
    @apply max-w-md;
    bottom: 10px;
    height: calc(95% - 80px - 20px);
    max-height: calc(800px);
    min-height: 250px;
  }
  .overlay-full{
    top: 80px;
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
}

.bg-translucent{
  background-color: rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 30px 0px rgb(30, 30, 30);
  transform: translateY(-30px);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.circlein-enter-active, .circlein-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}
.circlein-enter, .circlein-leave-to /* .circlein-leave-active below version 2.1.8 */ {
  transform: rotate(180deg) scale(0.2);
  opacity: 0;
}

.flyin-enter-active, .flyin-leave-active {
  transition: opacity 0.5s;
}
.flyin-enter, .flyin-leave-to /* .flyin-leave-active below version 2.1.8 */ {
  opacity: 0;
  @apply pointer-events-none;
}
.fadefast-enter-active, .fadefast-leave-active {
  transition: opacity 0.5s;
}
.fadefast-enter, .fadefast-leave-to /* .flyin-leave-active below version 2.1.8 */ {
  opacity: 0;
  @apply pointer-events-none;
}
.topnavbar{
  height: 60px;
}

.minus-navbar-height{
  height: calc(100% - 60px);
}
.minus-navbar-height:focus, *:focus{
  outline: none;
}

.bg-transparent-black{
  background-color: rgba(0,0,0,0.7);
}
.toolbarheight{
  height: 60px;
}
</style>
